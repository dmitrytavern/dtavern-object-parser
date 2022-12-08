import { PropertyOptionsRaw } from '@types'
import { compareConstructors, getConstructors } from '../utils/constructors'
import { usePropertySchema } from '../schema/createPropertySchema'
import { hasOwn, isFunction, isObject } from '../utils/objects'
import { ReadonlyProps, WritableProps, PropKey } from './tmp'

type ParseProperty = {
	(writableProps: WritableProps, key: PropKey, schema: PropertyOptionsRaw): void
	(
		readonlyObject: ReadonlyProps,
		writableProps: WritableProps,
		key: PropKey,
		schema?: PropertyOptionsRaw
	): void
}

type ParseOverload = {
	(...args): {
		readonlyObject: ReadonlyProps
		writableObject: WritableProps
		propertyKey: PropKey
		propertySchema: PropertyOptionsRaw
	}
}

export const parseProperty: ParseProperty = (...args): void => {
	const { readonlyObject, writableObject, propertyKey, propertySchema } =
		parseOverload(...args)

	let _propertyValue = readonlyObject ? readonlyObject[propertyKey] : undefined
	let _propertyExists = readonlyObject
		? hasOwn(readonlyObject, propertyKey)
		: false

	const type = propertySchema.type
	const required = propertySchema.required
	const defaultValue = propertySchema.default
	const validator = propertySchema.validator

	/**
	 * Exists checker
	 */
	if (!_propertyExists && required) {
		throw 'property not exists'
	}

	/**
	 * Default setter
	 */
	if (!_propertyExists && !required && defaultValue !== null) {
		_propertyExists = true
		_propertyValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue
	}

	/**
	 * Type checker
	 */
	if (_propertyExists && type.length > 0) {
		const _valueContructors = getConstructors(_propertyValue)
		if (!compareConstructors(_valueContructors, type)) {
			const constructors = `[${type
				.map((x) => x.prototype.constructor.name)
				.join(', ')}]`
			throw `property is not "${constructors}" type`
		}
	}

	/**
	 * Validator
	 */
	if (_propertyExists && validator !== null)
		if (!validator.call(null, _propertyValue))
			throw `property did not pass the validator. Value: ${_propertyValue}`

	writableObject[propertyKey] = _propertyValue
}

const parseOverload: ParseOverload = (
	object?,
	objectOrKey?,
	schemaOrKey?,
	objectSchema?
) => {
	const _isFull =
		typeof objectOrKey !== 'string' && typeof objectOrKey !== 'number'
	const _schema = _isFull ? objectSchema : schemaOrKey
	const result = {
		readonlyObject: object,
		writableObject: _isFull ? objectOrKey : object,
		propertyKey: _isFull ? schemaOrKey : objectOrKey,
		propertySchema: usePropertySchema(_schema),
	}

	if (!isObject(result.writableObject))
		throw _isFull
			? 'second argument must be an object if you have 4 arguments'
			: 'first argument must be an object if you have 3 arguments'

	return result
}
