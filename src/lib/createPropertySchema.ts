import { isHandledSchema, isPropertySchema } from '../utils/schema'
import { ParserError } from 'src/utils/errors'
import {
	metadata,
	M_IS_SCHEMA,
	M_IS_PROPERTY_SCHEMA,
	M_IS_HANDLED_SCHEMA,
	M_IS_ARRAY_CONSTRUCTOR,
	M_IS_PRIMITIVE_CONSTRUCTORS,
} from 'src/utils/metadata'
import {
	isConstructors,
	isPrimitiveConstructors,
	containsArrayConstructor,
} from 'src/utils/constructors'
import {
	isFunction,
	isObject,
	isArray,
	toArray,
	isDefined,
	isUndefined,
} from 'src/utils/shared'
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

const allowedKeys = Object.keys(defaultSchema)

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
	try {
		validateSchemaSettings(settings)

		const schema = Object.assign({}, defaultSchema, settings)

		parseSchemaType(schema)
		parseSchemaRequired(schema)
		parseSchemaDefault(schema)
		parseSchemaValidator(schema)

		validateSchemaKeys(schema)

		metadata.set(schema, M_IS_SCHEMA, false)
		metadata.set(schema, M_IS_PROPERTY_SCHEMA, true)
		metadata.set(schema, M_IS_HANDLED_SCHEMA, true)
		metadata.set(
			schema,
			M_IS_ARRAY_CONSTRUCTOR,
			containsArrayConstructor(schema.type)
		)
		metadata.set(
			schema,
			M_IS_PRIMITIVE_CONSTRUCTORS,
			isPrimitiveConstructors(schema.type)
		)

		validateSchemaType(schema)
		validateSchemaDefault(schema)
		validateSchemaValidator(schema)
		validateSchemaElement(schema)

		parseSchemaElement(schema)

		return Object.freeze(schema) as any
	} catch (e) {
		throw e
	}
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
 * Validators
 */
const validateSchemaSettings = (
	settings: PropertySchemaRaw | null | undefined
) => {
	const _argIsDefined = isDefined(settings)
	const _argIsArray = isArray(settings)
	const _argIsNotObject = !isObject(settings)
	const _argIsSomeSchema = isHandledSchema(settings)

	if (_argIsDefined && (_argIsArray || _argIsNotObject))
		throw new ParserError(
			`The schema argument must be null, undefined, or an object.`
		)

	if (_argIsDefined && _argIsSomeSchema)
		throw new ParserError(
			`The argument is already a schema (or a property schema).`
		)
}

const validateSchemaKeys = (schema: PropertySchemaTemplate) => {
	for (const key of Object.keys(schema))
		if (!allowedKeys.includes(key))
			throw new ParserError(
				`Unknown the key "${key}" in settings. Allowed: ${allowedKeys}`
			)
}

const validateSchemaType = (schema: PropertySchemaTemplate) => {
	const typeProp = schema.type
	const _typeIsNotAny = typeProp.length > 0
	const _typeIsNotConstructors = !isConstructors(typeProp)

	if (_typeIsNotAny && _typeIsNotConstructors)
		throw new ParserError(
			`Property "type" has no-constructor value. Must be null or a constructor.`
		)
}

const validateSchemaDefault = (schema: PropertySchemaTemplate) => {
	const typeProp = schema.type
	const defaultProp = schema.default
	const _typeIsAny = typeProp.length === 0
	const _typeIsNotAny = typeProp.length > 0
	const _typeIsNotPrimitive = !metadata.get(schema, M_IS_PRIMITIVE_CONSTRUCTORS)
	const _defaultIsObject = isObject(defaultProp)
	const _defaultIsDefined = isDefined(defaultProp)
	const _defaultIsNotFunction = !isFunction(defaultProp)

	if (
		(_defaultIsDefined && _typeIsAny && _defaultIsObject) ||
		(_defaultIsDefined &&
			_typeIsNotAny &&
			_typeIsNotPrimitive &&
			_defaultIsNotFunction)
	)
		throw new ParserError(
			`Property "default" must be a function if "type" is not a primitive type.`
		)
}

const validateSchemaValidator = (schema: PropertySchemaTemplate) => {
	const validatorProp = schema.validator
	const _validatorIsDefined = isDefined(validatorProp)
	const _validatorIsNotFunction = !isFunction(validatorProp)

	if (_validatorIsDefined && _validatorIsNotFunction)
		throw new ParserError(`Property "validator" must be a function.`)
}

const validateSchemaElement = (schema: PropertySchemaTemplate) => {
	const elementProp = schema.element
	const _schemaIsArray = metadata.get(schema, M_IS_ARRAY_CONSTRUCTOR)
	const _schemaIsNotArray = !_schemaIsArray
	const _eIsDefined = isDefined(elementProp)
	const _eIsNotObject = !isObject(elementProp)
	const _eIsNotFunction = !isFunction(elementProp)

	if (_schemaIsNotArray && _eIsDefined)
		throw new ParserError(
			`Property "element" must be null, Array, Function, or Schema.`
		)

	if (_schemaIsArray && _eIsDefined && _eIsNotObject && _eIsNotFunction)
		throw new ParserError(
			`Property "element" must be null if "type" is not an Array.`
		)
}

/**
 * Parsers
 */
const parseSchemaType = (schema: PropertySchemaTemplate) => {
	const _types = isUndefined(schema.type) ? [] : toArray(schema.type)
	schema.type = Object.freeze(_types)
}

const parseSchemaRequired = (schema: PropertySchemaTemplate) => {
	schema.required = !!schema.required
}

const parseSchemaDefault = (schema: PropertySchemaTemplate) => {
	if (isUndefined(schema.default)) schema.default = null
}

const parseSchemaValidator = (schema: PropertySchemaTemplate) => {
	if (isUndefined(schema.validator)) schema.validator = null
}

const parseSchemaElement = (schema: PropertySchemaTemplate) => {
	const _schemaIsNotArray = !metadata.get(schema, M_IS_ARRAY_CONSTRUCTOR)

	if (_schemaIsNotArray) {
		schema.element = null
		return
	}

	try {
		const elementSchema = schema.element

		if (isHandledSchema(elementSchema)) return

		schema.element = isUndefined(elementSchema)
			? createPropertySchema(null)
			: createPropertySchema({ type: elementSchema })
	} catch (error: any) {
		throw new ParserError(
			`Property "element" has an error with creating a property schema.\n    Error: ${error.message}`
		)
	}
}
