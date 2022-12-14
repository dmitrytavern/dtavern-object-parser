import { isConstructors, isPrimitiveConstructors } from 'src/utils/constructors'
import { isFunction, isObject, isArray, toArray } from 'src/utils/shared'
import { isHandledSchema, isPropertySchema } from '../utils/schema'
import { metadata } from 'src/utils/metadata'
import {
	PropertySchema,
	PropertySchemaRaw,
	PropertyRequiredRaw,
	PropertyTypeRaw,
	PropertyElementTypeRaw,
	PropertyDefault,
	PropertyValidator,
	PropertyTypeNormalize,
	PropertyElementNormalize,
	PropertyRequiredNormalize,
	PropertySchemaTemplate,
} from '@types'

const defaultSchema: PropertySchemaTemplate = {
	type: [],
	element: null,
	required: true,
	default: null,
	validator: null,
}

const schemaAllowKeys = Object.keys(defaultSchema)

/**
 * @public
 */
export const createPropertySchema = <
	TRaw extends PropertyTypeRaw,
	ERaw extends PropertyElementTypeRaw,
	RRaw extends PropertyRequiredRaw,
	D extends PropertyDefault<
		PropertyTypeNormalize<TRaw>,
		PropertyElementNormalize<ERaw>
	>,
	V extends PropertyValidator<
		PropertyTypeNormalize<TRaw>,
		PropertyElementNormalize<ERaw>
	>
>(
	settings: PropertySchemaRaw<TRaw, ERaw, RRaw, D, V> | null | undefined
): PropertySchema<
	PropertyTypeNormalize<TRaw>,
	PropertyElementNormalize<ERaw>,
	PropertyRequiredNormalize<RRaw>,
	D,
	V
> => {
	validateSchemaSettings(settings)

	const schema = Object.assign({}, defaultSchema, settings)

	parseSchemaType(schema)
	parseSchemaRequired(schema)

	validateSchemaKeys(schema)

	metadata.set(schema, 'isSchema', false)
	metadata.set(schema, 'isPropertySchema', true)

	validateSchemaType(schema)

	const _isArrayType = isArrayType(schema)
	const _isPrimitiveType = isPrimitiveConstructors(schema.type)

	metadata.set(schema, 'isArrayType', _isArrayType)
	metadata.set(schema, 'isPrimitiveType', _isPrimitiveType)

	validateSchemaDefault(schema)
	validateSchemaValidator(schema)
	validateSchemaElement(schema)

	if (_isArrayType) {
		parseSchemaElement(schema)
	}

	metadata.set(schema, 'isHandledSchema', true)

	return Object.freeze(schema) as any
}

export const usePropertySchema = <
	TRaw extends PropertyTypeRaw,
	ERaw extends PropertyElementTypeRaw,
	RRaw extends PropertyRequiredRaw,
	D extends PropertyDefault<
		PropertyTypeNormalize<TRaw>,
		PropertyElementNormalize<ERaw>
	>,
	V extends PropertyValidator<
		PropertyTypeNormalize<TRaw>,
		PropertyElementNormalize<ERaw>
	>
>(
	settings: PropertySchemaRaw<TRaw, ERaw, RRaw, D, V>
): PropertySchema<
	PropertyTypeNormalize<TRaw>,
	PropertyElementNormalize<ERaw>,
	PropertyRequiredNormalize<RRaw>,
	D,
	V
> =>
	isPropertySchema(settings)
		? (settings as any)
		: createPropertySchema(settings)

/**
 * Helpers
 */
const isArrayType = (schema: PropertySchemaTemplate) => {
	for (const type of schema.type) if (type === Array) return true
	return false
}

/**
 * Validators
 */
const validateSchemaSettings = (
	settings: PropertySchemaRaw | null | undefined
) => {
	if (
		(settings !== null && settings !== undefined && !isObject(settings)) ||
		isArray(settings)
	)
		throw 'argument is not null | undefined | object'

	if (isHandledSchema(settings))
		throw 'argument is already schema or property schema'
}

const validateSchemaKeys = (schema: PropertySchemaTemplate) => {
	for (const key of Object.keys(schema))
		if (!schemaAllowKeys.includes(key))
			throw `unknown setting key "${key}" in options. Allow: ${schemaAllowKeys}`
}

const validateSchemaType = (schema: PropertySchemaTemplate) => {
	if (schema.type.length > 0 && !isConstructors(schema.type))
		throw `type setting have no-function type. Must be Function`
}

const validateSchemaDefault = (schema: PropertySchemaTemplate) => {
	const _existsValue = schema.default !== null
	const _typeIsAny = schema.type.length === 0
	const _typeIsNotAny = schema.type.length > 0
	const _typeIsNotPrimitive = !metadata.get(schema, 'isPrimitiveType')
	const _defaultIsObject = isObject(schema.default)
	const _defaultIsNotFunction = !isFunction(schema.default)

	if (
		(_existsValue && _typeIsAny && _defaultIsObject) ||
		(_existsValue &&
			_typeIsNotAny &&
			_typeIsNotPrimitive &&
			_defaultIsNotFunction)
	)
		throw `use default setting as funtion for no primitive types`
}

const validateSchemaValidator = (schema: PropertySchemaTemplate) => {
	if (schema.validator !== null && !isFunction(schema.validator))
		throw `validator setting is not function. Must be null or Function`
}

const validateSchemaElement = (schema: PropertySchemaTemplate) => {
	const _isArray = metadata.get(schema, 'isArrayType')
	const _value = schema.element

	if (!_isArray && _value !== null)
		throw 'element is not null when type is not Array'

	if (_isArray && _value !== null && !isObject(_value) && !isFunction(_value))
		throw 'element is not null, Array, Function or Schema'
}

/**
 * Parsers
 */
const parseSchemaType = (schema: PropertySchemaTemplate) => {
	const _types =
		schema.type === null || schema.type === undefined
			? []
			: toArray(schema.type)

	schema.type = Object.freeze(_types)
}

const parseSchemaRequired = (schema: PropertySchemaTemplate) => {
	schema.required = !!schema.required
}

const parseSchemaElement = (schema: PropertySchemaTemplate) => {
	try {
		const elementSchema = schema.element

		if (isHandledSchema(elementSchema)) return

		schema.element =
			elementSchema === null
				? createPropertySchema(null)
				: createPropertySchema({ type: elementSchema })
	} catch (error) {
		throw (
			'element setting have error with creating property schema. Error: ' +
			error
		)
	}
}
