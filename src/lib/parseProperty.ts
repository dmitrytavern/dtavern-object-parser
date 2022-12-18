import { compareConstructors, getConstructors } from '../utils/constructors'
import { hasOwn, isFunction, isObject } from '../utils/shared'
import { usePropertySchema } from './createPropertySchema'
import { ParserError } from 'src/utils/errors'
import {
	PropertyKey,
	PropertySchemaRaw,
	ReadonlyObject,
	WritableObject,
} from '@types'

/**
 * Parses the property key in the object by the property schema.
 *
 * Note: if the property value is an array, the parser **doesn't parse array
 * elements by the schema from a `element` key**.
 *
 * ### Parser features
 *
 * #### Check the property's existence.
 *
 * If the `required` property in the schema is `true`, the parser
 * checks the existence of a key in the readonlyObject.
 * Otherwise, skips this feature.
 *
 * #### Set default value.
 *
 * If the `required` property in the schema is `false`, the key in
 * the readonlyObject is not exists and the `default` property is
 * set, the parser defines the key to the writableObject with the value
 * from the `default` property.
 *
 * #### Check the property type.
 *
 * If the property exists or the parser defined the key with the
 * default value, the parser checks the property value type.
 *
 * #### Call custom validator for checking value.
 *
 * If the property exists, or the parser defined the key with the
 * default value, and the property value has the correct type, the
 * parser calls the custom validator is it exists in the schema.
 *
 * ### Example
 *
 * ```typescript
 * const originalObject = {}
 * const newObject = {}
 *
 * parseProperty(originalObject, newObject, 'a', {
 *   type: String,
 *   required: false,
 *   default: 'Hello world',
 * })
 *
 * originalObject.a // undefined
 * newObject.a // 'Hello world'
 * ```
 *
 * @param readonlyObject The original object.
 * @param writableObject The object for writing the value.
 * @param key The property key.
 * @param schema The schema of the property.
 * @throws
 * - If the second argument is not an object.
 * - If the property not exists but required.
 * - If the property has invalid type.
 * - If the property didn't pass the schema validator.
 *
 * @public
 */
export function parseProperty(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	key: PropertyKey,
	schema: PropertySchemaRaw
): void

/**
 * Parses the property key in the object by the property schema.
 *
 * Note: if the property value is an array, the parser **doesn't parse array
 * elements by the schema from a `element` key**.
 *
 * ### Parser features:
 *
 * #### Check the property's existence.
 *
 * If the `required` property in the schema is `true`, the parser
 * checks the existence of a key in the readonlyObject.
 * Otherwise, skips this feature.
 *
 * #### Set default value.
 *
 * If the `required` property in the schema is `false`, the key in
 * the readonlyObject is not exists and the `default` property is
 * set, the parser defines the key to the writableObject with the value
 * from the `default` property.
 *
 * #### Check the property type.
 *
 * If the property exists or the parser defined the key with the
 * default value, the parser checks the property value type.
 *
 * #### Call custom validator for checking value.
 *
 * If the property exists, or the parser defined the key with the
 * default value, and the property value has the correct type, the
 * parser calls the custom validator is it exists in the schema.
 *
 * ### Example
 *
 * ```typescript
 * const object = {}
 *
 * parseProperty(object, 'a', {
 *   type: String,
 *   required: false,
 *   default: 'Hello world',
 * })
 *
 * object.a // 'Hello world'
 * ```
 *
 * @param object The object for reading and writing the value.
 * @param key The property key.
 * @param schema The schema of the property.
 * @throws
 * - If the first argument is not an object.
 * - If the property not exists but required.
 * - If the property has invalid type.
 * - If the property didn't pass the schema validator.
 *
 * @public
 */
export function parseProperty(
	writableObject: WritableObject,
	key: PropertyKey,
	schema: PropertySchemaRaw
): void

export function parseProperty(
	object?,
	objectOrKey?,
	schemaOrKey?,
	objectSchema?
): void {
	const _isFull = isObject(objectOrKey)
	const _schema = _isFull ? objectSchema : schemaOrKey
	const readonlyObject = object
	const writableObject = _isFull ? objectOrKey : object
	const propertyKey = _isFull ? schemaOrKey : objectOrKey
	const propertySchema = usePropertySchema(_schema)

	if (!isObject(writableObject)) {
		const order = _isFull ? 'second' : 'first'
		const count = _isFull ? '4' : '3'

		throw new ParserError(
			`The ${order} argument must be an object if you have ${count} arguments`
		)
	}

	let _propertyValueIsDefault = false
	let _propertyValue = readonlyObject ? readonlyObject[propertyKey] : undefined
	let _propertyExists = readonlyObject
		? hasOwn(readonlyObject, propertyKey)
		: false

	const type = propertySchema.type
	const required = propertySchema.required
	const defaultValue = propertySchema.default
	const validator = propertySchema.validator

	// Exists checker
	if (!_propertyExists && required) {
		throw new ParserError('The property not exists in the object.')
	}

	// Default setter
	if (!_propertyExists && !required && defaultValue !== null) {
		_propertyExists = true
		_propertyValueIsDefault = true
		_propertyValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue
	}

	// Type checker
	if (_propertyExists && type.length > 0) {
		const _valueContructors = getConstructors(_propertyValue)
		if (!compareConstructors(_valueContructors, type)) {
			const typeConstructorsString =
				'Must be: ' +
				(type.length === 1
					? `the ${type[0].prototype.constructor.name}`
					: `${type.map((x) => x.prototype.constructor.name).join(', ')}`)

			const valueConstructorsString =
				'Value constructors: ' +
				_valueContructors.map((x) => x.prototype.constructor.name).join(', ')

			const defaultString = _propertyValueIsDefault ? ' (default)' : ''

			throw new ParserError(
				`The property has an invalid type.\n    Value: ${_propertyValue}${defaultString}.\n    ${valueConstructorsString}.\n    ${typeConstructorsString}.`
			)
		}
	}

	// Validator
	if (_propertyExists && validator !== null) {
		try {
			if (!validator.call(null, _propertyValue)) throw `returns false`
		} catch (error) {
			const s = isObject(error) ? (error as any).message : error

			throw new ParserError(
				`The property did not pass the validator.\n    Value: ${_propertyValue}.\n    Error: ${s}`
			)
		}
	}

	writableObject[propertyKey] = _propertyValue
}
