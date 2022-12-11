import { isFunction, isObject, isArray, toArray } from 'src/utils/objects'
import { isHandledSchema, isPropertySchema } from './helpers'
import { isConstructors } from 'src/utils/constructors'
import { metadata } from 'src/utils/metadata'
import {
	PropertyOptions,
	PropertyType,
	PropertyTypeArray,
	PropertyRequired,
	PropertyDefault,
	PropertyValidator,
	PropertyOptionsRaw,
} from '@types'

const defaultSchema: PropertyOptions = {
	type: [],
	typeElement: null,
	required: true,
	default: null,
	validator: null,
}

const schemaAllowKeys = Object.keys(defaultSchema)
const schemaPrimitiveTypes = [
	null,
	undefined,
	String,
	Number,
	Boolean,
	BigInt,
	Symbol,
]

/**
 * @public
 */
export const createPropertySchema = <
	Type extends PropertyType = any,
	TypeArray extends PropertyTypeArray = any,
	Required extends PropertyRequired = any,
	Default extends PropertyDefault<Type, TypeArray> = any,
	Validator extends PropertyValidator<Type, TypeArray> = any
>(
	settings:
		| PropertyOptionsRaw<Type, TypeArray, Required, Default, Validator>
		| null
		| undefined
): PropertyOptions<Type, TypeArray, Required, Default, Validator> => {
	validateSchemaSettings(settings)

	const schema = Object.assign({}, defaultSchema, settings)

	parseSchemaType(schema)
	parseSchemaRequired(schema)

	validateSchemaKeys(schema)

	metadata.set(schema, 'isSchema', false)
	metadata.set(schema, 'isPropertySchema', true)

	validateSchemaType(schema)

	const _isArrayType = isArrayType(schema)
	const _isPrimitiveType = isPrimitiveType(schema)

	metadata.set(schema, 'isArrayType', _isArrayType)
	metadata.set(schema, 'isPrimitiveType', _isPrimitiveType)

	validateSchemaDefault(schema)
	validateSchemaValidator(schema)
	validateSchemaElement(schema)

	if (_isArrayType) {
		parseSchemaElement(schema)
	}

	metadata.set(schema, 'isHandledSchema', true)

	return Object.freeze(schema)
}

export const usePropertySchema = <
	Type extends PropertyType = any,
	TypeArray extends PropertyTypeArray = any,
	Required extends PropertyRequired = any,
	Default extends PropertyDefault<Type, TypeArray> = any,
	Validator extends PropertyValidator<Type, TypeArray> = any
>(
	settings: PropertyOptionsRaw<Type, TypeArray, Required, Default, Validator>
): PropertyOptions<Type, TypeArray, Required, Default, Validator> =>
	isPropertySchema(settings)
		? (settings as any)
		: createPropertySchema(settings)

/**
 * Helpers
 */
const isArrayType = (schema: PropertyOptions) => {
	for (const type of schema.type) if (type === Array) return true
	return false
}

const isPrimitiveType = (schema: PropertyOptions) => {
	for (const type of schema.type)
		if (!schemaPrimitiveTypes.includes(type)) return false
	return true
}

/**
 * Validators
 */
const validateSchemaSettings = (
	settings: PropertyOptionsRaw | null | undefined
) => {
	if (
		(settings !== null && settings !== undefined && !isObject(settings)) ||
		isArray(settings)
	)
		throw 'argument is not null | undefined | object'

	if (isHandledSchema(settings))
		throw 'argument is already schema or property schema'
}

const validateSchemaKeys = (schema: PropertyOptions) => {
	for (const key of Object.keys(schema))
		if (!schemaAllowKeys.includes(key))
			throw `unknown setting key "${key}" in options. Allow: ${schemaAllowKeys}`
}

const validateSchemaType = (schema: PropertyOptions) => {
	if (schema.type.length > 0 && !isConstructors(schema.type))
		throw `type setting have no-function type. Must be Function`
}

const validateSchemaDefault = (schema: PropertyOptions) => {
	const _existsValue = schema.default !== null
	const _typeNotPrimitive = !metadata.get(schema, 'isPrimitiveType')
	const _isNotFunction = !isFunction(schema.default)

	if (_existsValue && _typeNotPrimitive && _isNotFunction)
		throw `use default setting as funtion for no primitive types`
}

const validateSchemaValidator = (schema: PropertyOptions) => {
	if (schema.validator !== null && !isFunction(schema.validator))
		throw `validator setting is not function. Must be null or Function`
}

const validateSchemaElement = (schema: PropertyOptions) => {
	const _isArray = metadata.get(schema, 'isArrayType')
	const _value = schema.typeElement

	if (!_isArray && _value !== null)
		throw 'typeElement is not null when type is not Array'

	if (_isArray && _value !== null && !isObject(_value) && !isFunction(_value))
		throw 'typeElement is not null, Array, Function or Schema'
}

/**
 * Parsers
 */
const parseSchemaType = (schema: PropertyOptions) => {
	const _types =
		schema.type === null || schema.type === undefined
			? []
			: toArray(schema.type)

	schema.type = Object.freeze(_types)
}

const parseSchemaRequired = (schema: PropertyOptions) => {
	schema.required = !!schema.required
}

const parseSchemaElement = (schema: PropertyOptions) => {
	try {
		const elementSchema = schema.typeElement

		if (isHandledSchema(elementSchema)) return

		schema.typeElement =
			elementSchema === null
				? createPropertySchema(null)
				: createPropertySchema({ type: elementSchema })
	} catch (error) {
		throw (
			'typeElement setting have error with creating property schema. Error: ' +
			error
		)
	}
}
