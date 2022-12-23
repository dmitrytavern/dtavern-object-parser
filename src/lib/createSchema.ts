import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { isArray, isObject, isUndefined } from '../utils/shared'
import { createObjectError, ObjectError } from '../utils/errors'
import { isHandledSchema, isSchema } from '../utils/schema'
import { createPropertySchema } from './createPropertySchema'
import { isConstructors } from '../utils/constructors'
import {
	metadata,
	M_IS_SCHEMA,
	M_IS_PROPERTY_SCHEMA,
	M_IS_HANDLED_SCHEMA,
} from '../utils/metadata'
import {
	Schema,
	RawSchema,
	ReadonlyObject,
	WritableObject,
	PropertyKey,
	RawSchemaAsArray,
	RawSchemaAsObject,
} from '@types'

/**
 * Returns ready the schema for parsing an object.
 *
 * Note: schema properties must be a `null`, `undefined`, `constructor`,
 * `array of constructors`, or `object`. Also, allowed the use of other schemas.
 *
 * ### Example
 *
 * ```typescript
 * createSchema({})
 * createSchema({
 *   a1: String,
 *   b1: [String, Number],
 *   c1: {
 *     a2: createPropertySchema({
 *       type: String
 *     }),
 *     b2: createSchema({
 *       a3: {
 *         a4: String
 *       }
 *     })
 *   }
 * })
 * ```
 *
 * @param rawSchema Raw schema.
 * @returns The schema.
 * @throws
 * - If the argument is not an object.
 * - If the raw schema has a circular structure.
 * - If some property is not a funciton, an array or an object.
 *
 * @public
 */
export function createSchema<SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> {
	validateRawSchema(rawSchema)

	const store = useHandlerStore()
	const _rawSchema = isArray(rawSchema)
		? generateRawSchemaByPaths(rawSchema)
		: (rawSchema as RawSchemaAsObject)

	const result = parseSchemaObject(_rawSchema, store)

	const errors = handler.validate(store)

	handler.clear(store)

	if (errors.length > 0) throw errors

	return result
}

/**
 * Returns the schema from the argument or create schema
 * by the argument value.
 *
 * Use it if you are not sure the object is a schema.
 *
 * @param settings Schema or raw schema.
 * @returns The schema.
 * @throws If the raw schema is invalid schema.
 * @public
 */
export function useSchema<SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> {
	return isSchema(rawSchema)
		? (rawSchema as any)
		: createSchema(rawSchema as RawSchema)
}

/**
 * Validate the argument of `createSchema`.
 *
 * @param setting The argument of `createSchema`.
 * @throws If the argument is `null`, `undefined`, or not an `object`.
 * @internal
 */
const validateRawSchema = (rawSchema: RawSchema) => {
	if (isUndefined(rawSchema) || !isObject(rawSchema))
		throw `The property schema argument must be an array or an object.`
}

/**
 * Converts the raw schema to the schema.
 *
 * @param rawSchema Schema, a property schema or a raw schema.
 * @param store The handler store.
 * @returns The schema.
 * @internal
 */
const parseSchemaObject = (
	schema: RawSchemaAsObject,
	store: HandlerStore
): any => {
	if (isHandledSchema(schema)) return schema as Schema<any>

	const schemaObjectError = validateSchemaObject(schema)
	if (schemaObjectError) return handler.error(store, schemaObjectError)

	handler.handle(store, schema)

	const schemaCopy = {}

	metadata.set(schemaCopy, M_IS_SCHEMA, true)
	metadata.set(schemaCopy, M_IS_PROPERTY_SCHEMA, false)
	metadata.set(schemaCopy, M_IS_HANDLED_SCHEMA, true)

	for (const propertyKey in schema) {
		handler.set(store, propertyKey)

		parseSchemaProperty(schema, schemaCopy, propertyKey, store)

		handler.unset(store)
	}

	return Object.freeze(schemaCopy)
}

/**
 * Write schema to the writable object by property key.
 *
 * Note: if the property value is not a `null`, `undefined`,
 * `constructors` or `object`, adds an error to the handler store.
 *
 * @param readonlyObject Original raw schema.
 * @param writableObject Schema.
 * @param key Property key of original raw schema.
 * @param store The handler store.
 * @internal
 */
const parseSchemaProperty = (
	readonlyObject: NonNullable<ReadonlyObject>,
	writableObject: WritableObject,
	key: PropertyKey,
	store: HandlerStore
) => {
	const property = readonlyObject[key]

	if (isUndefined(property) || isConstructors(property)) {
		writableObject[key] = createPropertySchema({
			type: property,
		})

		return
	}

	if (isObject(property)) {
		writableObject[key] = parseSchemaObject(property, store)
		return
	}

	handler.error(
		store,
		createObjectError('The property must be a function, an array or an object.')
	)
}

/**
 * Returns raw schema created by strings from the array.
 *
 * @param rawArraySchema Array of string.
 * @returns Raw schema.
 * @example
 *
 * ```typescript
 * generateRawSchemaByPaths(['a1.a2'])
 * // Result:
 * // {
 * //   a1: {
 * //     b2: null,
 * //   }
 * // }
 * ```
 *
 * @internal
 */
const generateRawSchemaByPaths = (
	rawArraySchema: RawSchemaAsArray
): RawSchemaAsObject => {
	const rawObjectSchema = {}

	for (const stringPath of rawArraySchema) {
		const arrayPath = stringPath.split('.')
		let objectLink = rawObjectSchema

		for (let i = 0; i < arrayPath.length; i++) {
			const key = arrayPath[i]
			const isObj = isObject(objectLink[key])

			if (i === arrayPath.length - 1) {
				if (!isObj) objectLink[key] = null
			} else {
				if (!isObj) objectLink[key] = {}
				objectLink = objectLink[key]
			}
		}
	}

	return rawObjectSchema
}

/**
 * Validate the schema object by a circular structure.
 *
 * @param schema The schema object.
 */
const validateSchemaObject = (
	schema: RawSchemaAsObject
): ObjectError | undefined => {
	if (handler.isHandled(schema))
		return createObjectError(`detected a circular structure`)
}
