import { compareConstructors, getConstructors } from '../utils/constructors'
import { hasOwn, isFunction, isObject } from '../utils/shared'
import { usePropertySchema } from './createPropertySchema'
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
	const _isFull = typeof objectOrKey === 'object'
	const _schema = _isFull ? objectSchema : schemaOrKey
	const readonlyObject = object
	const writableObject = _isFull ? objectOrKey : object
	const propertyKey = _isFull ? schemaOrKey : objectOrKey
	const propertySchema = usePropertySchema(_schema)

	if (!isObject(writableObject))
		throw _isFull
			? 'second argument must be an object if you have 4 arguments'
			: 'first argument must be an object if you have 3 arguments'

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
		throw 'property not exists'
	}

	// Default setter
	if (!_propertyExists && !required && defaultValue !== null) {
		_propertyExists = true
		_propertyValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue
	}

	// Type checker
	if (_propertyExists && type.length > 0) {
		const _valueContructors = getConstructors(_propertyValue)
		if (!compareConstructors(_valueContructors, type)) {
			const constructors = `[${type
				.map((x) => x.prototype.constructor.name)
				.join(', ')}]`
			throw `property is not "${constructors}" type`
		}
	}

	// Validator
	if (_propertyExists && validator !== null)
		if (!validator.call(null, _propertyValue))
			throw `property did not pass the validator. Value: ${_propertyValue}`

	writableObject[propertyKey] = _propertyValue
}
