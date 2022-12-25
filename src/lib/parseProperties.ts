import { createObjectError, GeneralError, ObjectError } from '../utils/errors'
import { useConfig, PropertiesConfig, RequiredConfig } from '../utils/config'
import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { hasOwn, isArray, isObject, isUndefined } from '../utils/shared'
import { isSchema, isArrayTypeSchema } from '../utils/schema'
import { parseProperty } from './parseProperty'
import { useSchema } from './createSchema'
import {
	Schema,
	RawSchema,
	SchemaReturn,
	PropertySchema,
	PropertiesSchema,
	ReadonlyObject,
	WritableObject,
} from '@types'

/**
 * The result object type of parsing.
 */
type ParserReturns<T> = {
	value: T
	errors: GeneralError[]
}

/**
 * Parses the object by the schema.
 *
 * ### Example
 *
 * ```typescript
 * const object = { a: 'Hello' }
 * const config = { clone: true }
 * const schema = createSchema({
 *   a: String,
 *   b: createPropertySchema({
 *     type: String,
 *     required: false,
 *     default: 'World'
 *   })
 * })
 *
 * const { value: newObject, errors } = parseProperties(object, schema, config)
 *
 * object.a // 'Hello'
 * object.b // undefined
 * newObject.a // 'Hello'
 * newObject.b // 'World'
 * errors // []
 * ```
 *
 * Note: when you pass the raw schema to the function, this raw
 * schema will be transformed to schema **on every parse**! It's bad
 * for performance.
 *
 * @param object The object to parse.
 * @param schema The schema or the raw schema for parse.
 * @param config The parser config.
 * @throws If arguments is invalid.
 * @returns Object with `value` and `errors` props.
 * @public
 */
export function parseProperties<S extends Schema | RawSchema>(
	object: ReadonlyObject,
	schema: PropertiesSchema,
	config?: PropertiesConfig
): ParserReturns<SchemaReturn<S>> {
	const readonlyObject = object
	const propertiesConfig = useConfig(config)
	const propertiesSchema = useSchema(schema)
	const writableObject = useWritableObject(readonlyObject, propertiesConfig)
	const store = useHandlerStore()

	handlePropertiesBySchema(
		readonlyObject,
		writableObject,
		propertiesSchema,
		store,
		propertiesConfig
	)

	handler.clear(store)

	return {
		errors: handler.validate(store),
		value: writableObject as any,
	}
}

/**
 * Async parses the object by the schema.
 *
 * ### Example
 *
 * ```typescript
 * const object = { a: 'Hello' }
 * const config = { clone: true }
 * const schema = createSchema({
 *   a: String,
 *   b: createPropertySchema({
 *     type: String,
 *     required: false,
 *     default: 'World'
 *   })
 * })
 *
 * async function() {
 *   const newObject = await parseProperties(object, schema, config)
 *
 *   object.a // 'Hello'
 *   object.b // undefined
 *   newObject.a // 'Hello'
 *   newObject.b // 'World'
 * }
 * ```
 *
 * Note: when you pass the raw schema to the function, this raw
 * schema will be transformed to schema **on every parse**! It's bad
 * for performance.
 *
 * @param object The object to parse.
 * @param schema The schema or the raw schema for parse.
 * @param config The parser config.
 * @throws If the parser has errors.
 * @returns Parsed object.
 * @public
 */
export async function parsePropertiesAsync<S extends Schema | RawSchema>(
	object: ReadonlyObject,
	schema: PropertiesSchema,
	config?: PropertiesConfig
): Promise<SchemaReturn<S>> {
	const { value, errors } = parseProperties<S>(object, schema, config)
	if (errors.length) throw errors
	return value
}

/**
 * Handles every property in the schema.
 *
 * @param readonlyObject The original object.
 * @param writableObject The object for writing properies.
 * @param schema The schema of the original object.
 * @param store The handler store.
 * @param config The parser config.
 */
function handlePropertiesBySchema(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	schema: Schema,
	store: HandlerStore,
	config: RequiredConfig
) {
	const readonlyObjectError = validateReadonlyObject(readonlyObject, schema)
	if (readonlyObjectError) return handler.error(store, readonlyObjectError)

	const writableObjectError = validateWritableObject(writableObject)
	if (writableObjectError) return handler.error(store, writableObjectError)

	handler.handle(store, writableObject)

	for (const propertyKey in schema) {
		handler.set(store, propertyKey)

		handleProperty(
			readonlyObject,
			writableObject,
			propertyKey,
			schema[propertyKey],
			store,
			config
		)

		handler.unset(store)
	}
}

/**
 * Handles every property in the original object by the schema.
 *
 * @param readonlyObject The original object.
 * @param writableObject The object for writing properies.
 * @param schema The schema of the original object.
 * @param store The handler store.
 * @param config The parser config.
 */
function handlePropertiesByOneSchema(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertySchema: Schema,
	store: HandlerStore,
	config: RequiredConfig
) {
	if (!readonlyObject) return

	const writableObjectError = validateWritableObject(writableObject)
	if (writableObjectError) return handler.error(store, writableObjectError)

	handler.handle(store, writableObject)

	for (const propertyKey in readonlyObject) {
		handler.set(store, +propertyKey)

		handleProperty(
			readonlyObject,
			writableObject,
			propertyKey,
			propertySchema,
			store,
			config
		)

		handler.unset(store)
	}
}

/**
 * Handles the property by the schema.
 *
 * @param readonlyObject The original object.
 * @param writableObject The object for writing properies.
 * @param schema The schema of the property.
 * @param store The handler store.
 * @param config The parser config.
 */
function handleProperty(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertyKey: string,
	schema: Schema,
	store: HandlerStore,
	config: RequiredConfig
) {
	if (isSchema(schema)) {
		if (!isObject(writableObject[propertyKey])) {
			writableObject[propertyKey] = {}
		}

		handlePropertiesBySchema(
			readonlyObject && readonlyObject[propertyKey],
			writableObject[propertyKey],
			schema,
			store,
			config
		)

		return
	}

	handlePropertyValue(
		readonlyObject,
		writableObject,
		propertyKey,
		schema,
		store,
		config
	)
}

/**
 * Handles the property by the property schema.
 *
 * @param readonlyObject The original object.
 * @param writableObject The object for writing the property.
 * @param propertyKey The property key.
 * @param propertySchema The property schema.
 * @param store The handler store.
 * @param config The parser config.
 */
function handlePropertyValue(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertyKey: string,
	propertySchema: PropertySchema,
	store: HandlerStore,
	config: RequiredConfig
) {
	const propertyError = parseProperty(
		readonlyObject,
		writableObject,
		propertyKey,
		propertySchema
	)

	if (propertyError) {
		handler.error(store, propertyError)
		return
	}

	if (
		isArrayTypeSchema(propertySchema) &&
		isArray(writableObject[propertyKey])
	) {
		const readonlyArray =
			readonlyObject && isArray(readonlyObject[propertyKey])
				? readonlyObject[propertyKey]
				: writableObject[propertyKey]

		writableObject[propertyKey] =
			config.clone && readonlyObject && isArray(readonlyObject[propertyKey])
				? []
				: writableObject[propertyKey]

		handlePropertiesByOneSchema(
			readonlyArray,
			writableObject[propertyKey],
			propertySchema['element'],
			store,
			config
		)
	}
}

/**
 * Returns the object for writing properties. If in the config the
 * key `clone` is `true`, the writable object will be the empty object.
 * Otherwise, will be the original object.
 *
 * @param readonlyObject The original object.
 * @param config The parser config.
 * @returns The object for writing properties.
 * @throws If the original object is not a null, undefined, or object.
 */
const useWritableObject = (
	readonlyObject: ReadonlyObject,
	config: RequiredConfig
): WritableObject => {
	if (isUndefined(readonlyObject)) config.clone = true

	if (config.clone) return {}

	if (isObject(readonlyObject)) return readonlyObject as object

	throw `The first argument must be null, undefined, or an object.`
}

/**
 * Validate the original object keys by comparing object and schema keys.
 *
 * @param readonlyObject The original object.
 * @param schema The schema of the original object.
 * @returns ObjectError or undefined.
 */
const validateReadonlyObject = (
	readonlyObject: ReadonlyObject,
	schema: Schema
): ObjectError | undefined => {
	if (isUndefined(readonlyObject)) return

	const errorKeys: string[] = []

	for (const propertyKey in readonlyObject) {
		if (!hasOwn(schema, propertyKey)) {
			errorKeys.push(propertyKey)
		}
	}

	if (errorKeys.length > 0) {
		const s = errorKeys.join(' | ')
		return createObjectError(
			`The object has "${s}" keys which not found in the schema`
		)
	}
}

/**
 * Validate the writable object by a circular structure.
 *
 * @param writableObject The writable object.
 * @returns ObjectError or undefined.
 */
const validateWritableObject = (
	writableObject: WritableObject
): ObjectError | undefined => {
	if (handler.isHandled(writableObject))
		return createObjectError(`detected a circular structure`)
}
