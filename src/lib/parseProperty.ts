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

export type ParseProperty = {
	(
		writableProps: WritableObject,
		key: PropertyKey,
		schema: PropertySchemaRaw
	): void
	(
		readonlyObject: ReadonlyObject,
		writableProps: WritableObject,
		key: PropertyKey,
		schema?: PropertySchemaRaw
	): void
}

/**
 * @public
 */
export const parseProperty: ParseProperty = (
	object?,
	objectOrKey?,
	schemaOrKey?,
	objectSchema?
): void => {
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
