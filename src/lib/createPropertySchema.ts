import { isHandledSchema, isPropertySchema } from '../utils/schema'
import {
	metadata,
	M_IS_SCHEMA,
	M_IS_PROPERTY_SCHEMA,
	M_IS_HANDLED_SCHEMA,
	M_IS_ARRAY_CONSTRUCTOR,
	M_IS_PRIMITIVE_CONSTRUCTORS,
} from '../utils/metadata'
import {
	isConstructors,
	isPrimitiveConstructors,
	containsArrayConstructor,
} from '../utils/constructors'
import {
	isFunction,
	isObject,
	isArray,
	toArray,
	isDefined,
	isUndefined,
} from '../utils/shared'
import {
	PropertySchema,
	PropertySchemaRaw,
	PropertyRequiredRaw,
	PropertyTypeRaw,
	PropertyElementTypeRaw,
	PropertyTypeNormalize,
	PropertyElementNormalize,
	PropertyRequiredNormalize,
	PropertySchemaTemplate,
} from '@types'

/**
 * Default the property schema.
 *
 * @internal
 */
const defaultSchema: PropertySchemaTemplate = {
	type: [],
	element: null,
	required: true,
	default: null,
	validator: null,
	skipDefaultValidate: false,
}

/**
 * Allowed keys for the property schema.
 *
 * @internal
 */
const allowedKeys = Object.keys(defaultSchema)

/**
 * Returns ready the property schema for customizing the schema key.
 *
 * Use it for setting:
 * - `type` - type of the object key value.
 * - `element` - set a schema for array elements.
 * - `required` - check the existence of a property in an object.
 * - `default` - set default value of a property in an object.
 * - `validator` - set custom validator for a value.
 * - `skipDefaultValidate` - skip calling validator on default value.
 *
 * ### Example
 *
 * ```typescript
 * createPropertySchema(null)
 * createPropertySchema({})
 * createPropertySchema({
 *   type: String,
 *   required: true,
 *   default: 'Hello world',
 *   validator: (str) => str.length > 0,
 *   skipDefaultValidate: false,
 * })
 * ```
 *
 * Note:
 * - If the argument is `null` or `undefined`, returns default property schema.
 * - If the `type` is an ArrayConstructor or an array that contains ArrayConstructor,
 * you can set the `element` key. Otherwise, skip this setting.
 * - If the `type` is an object constructor, the `default` setting can be only a function.
 *
 * @param settings Property schema settings or the property schema.
 * @returns The property schema.
 * @throws
 * - If the argument is not an object or already a schema.
 * - If the argument constains not allowed keys.
 * - If the argument keys is invalid type.
 *
 * @public
 */
export function createPropertySchema<
	TRaw extends PropertyTypeRaw,
	ERaw extends PropertyElementTypeRaw,
	RRaw extends PropertyRequiredRaw
>(
	settings: PropertySchemaRaw<TRaw, ERaw, RRaw> | null | undefined
): PropertySchema<
	PropertyTypeNormalize<TRaw>,
	PropertyElementNormalize<ERaw>,
	PropertyRequiredNormalize<RRaw>
> {
	try {
		validateSchemaSettings(settings)

		const schema = Object.assign({}, defaultSchema, settings)

		validateSchemaKeys(schema)

		parseSchemaBooleanKey(schema, 'required')
		parseSchemaBooleanKey(schema, 'skipDefaultValidate')
		parseSchemaType(schema)
		parseSchemaDefault(schema)
		parseSchemaValidator(schema)

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

/**
 * Returns the property schema from the argument or create property schema
 * by the argument value.
 *
 * Use it if you are not sure the object is a property schema.
 *
 * @param settings Property schema settings or the property schema.
 * @returns The property schema.
 * @public
 */
export function usePropertySchema<
	TRaw extends PropertyTypeRaw,
	ERaw extends PropertyElementTypeRaw,
	RRaw extends PropertyRequiredRaw
>(
	settings: PropertySchemaRaw<TRaw, ERaw, RRaw>
): PropertySchema<
	PropertyTypeNormalize<TRaw>,
	PropertyElementNormalize<ERaw>,
	PropertyRequiredNormalize<RRaw>
> {
	return isPropertySchema(settings)
		? (settings as any)
		: createPropertySchema(settings)
}

/**
 * Validate the argument of `createPropertySchema`.
 *
 * @param setting The argument of `createPropertySchema`.
 * @throws If the argument is a schema or not null, undefined, object.
 * @internal
 */
const validateSchemaSettings = (
	settings: PropertySchemaRaw | null | undefined
) => {
	const _argIsDefined = isDefined(settings)
	const _argIsArray = isArray(settings)
	const _argIsNotObject = !isObject(settings)
	const _argIsSomeSchema = isHandledSchema(settings)

	if (_argIsDefined && (_argIsArray || _argIsNotObject))
		throw `The schema argument must be null, undefined, or an object.`

	if (_argIsDefined && _argIsSomeSchema)
		throw `The argument is already a schema (or a property schema).`
}

/**
 * Validate the schema by allowed keys.
 *
 * @param schema Not handled schema.
 * @throws If the schema has unknown keys.
 * @internal
 */
const validateSchemaKeys = (schema: PropertySchemaTemplate) => {
	for (const key of Object.keys(schema))
		if (!allowedKeys.includes(key))
			throw `Unknown the key "${key}" in settings. Allowed: ${allowedKeys}`
}

/**
 * Validate the schema `type` key.
 *
 * @param schema Not handled schema.
 * @throws If the type key contains no constructor value.
 * @internal
 */
const validateSchemaType = (schema: PropertySchemaTemplate) => {
	const typeProp = schema.type
	const _typeIsNotAny = typeProp.length > 0
	const _typeIsNotConstructors = !isConstructors(typeProp)

	if (_typeIsNotAny && _typeIsNotConstructors)
		throw `Property "type" has no-constructor value. Must be null or a constructor.`
}

/**
 * Validate the schema `default` key.
 *
 * @param schema Not handled schema.
 * @throws
 * - If the "type" key is empty array (any type) and default value is an object.
 * - If the "type" key has no primitive constructros and default is not a function.
 *
 * @internal
 */
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
		throw `Property "default" must be a function if "type" is not a primitive type.`
}

/**
 * Validate the schema `validator` key.
 *
 * @param schema Not handled schema.
 * @throws If the validator key is not a function.
 * @internal
 */
const validateSchemaValidator = (schema: PropertySchemaTemplate) => {
	const validatorProp = schema.validator
	const _validatorIsDefined = isDefined(validatorProp)
	const _validatorIsNotFunction = !isFunction(validatorProp)

	if (_validatorIsDefined && _validatorIsNotFunction)
		throw `Property "validator" must be a function.`
}

/**
 * Validate the schema `element` key.
 *
 * @param schema Not handled schema.
 * @throws
 * - If the `type` key not contains ArrayConstructor and the `element` key is defined.
 * - If the `element` key is not null, Array, Constructors, or Schema.
 *
 * @internal
 */
const validateSchemaElement = (schema: PropertySchemaTemplate) => {
	const elementProp = schema.element
	const _schemaIsArray = metadata.get(schema, M_IS_ARRAY_CONSTRUCTOR)
	const _schemaIsNotArray = !_schemaIsArray
	const _eIsDefined = isDefined(elementProp)
	const _eIsNotObject = !isObject(elementProp)
	const _eIsNotFunction = !isFunction(elementProp)

	if (_schemaIsNotArray && _eIsDefined)
		throw `Property "element" must be null if "type" is not an Array.`

	if (_schemaIsArray && _eIsDefined && _eIsNotObject && _eIsNotFunction)
		throw `Property "element" must be null, Array, Function, or Schema.`
}

/**
 * Converts the schema `type` key to freezed array.
 *
 * @param schema Not handled schema.
 * @internal
 */
const parseSchemaType = (schema: PropertySchemaTemplate) => {
	const _types = isUndefined(schema.type) ? [] : toArray(schema.type)
	schema.type = Object.freeze(_types)
}

/**
 * Converts the schema key to boolean type.
 *
 * @param schema Not handled schema.
 * @param key Key of property schema template.
 * @internal
 */
const parseSchemaBooleanKey = (
	schema: PropertySchemaTemplate,
	key: keyof PropertySchemaTemplate
) => {
	schema[key] = !!schema[key]
}

/**
 * Converts the schema `default` key to null.
 *
 * @param schema Not handled schema.
 * @internal
 */
const parseSchemaDefault = (schema: PropertySchemaTemplate) => {
	if (isUndefined(schema.default)) schema.default = null
}

/**
 * Converts the schema `validator` key to null.
 *
 * @param schema Not handled schema.
 * @internal
 */
const parseSchemaValidator = (schema: PropertySchemaTemplate) => {
	if (isUndefined(schema.validator)) schema.validator = null
}

/**
 * Converts the schema `element` key to null or the property schema.
 *
 * @param schema Not handled schema.
 * @internal
 */
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
		throw `Property "element" has an error with creating a property schema. Error: ${error}`
	}
}
