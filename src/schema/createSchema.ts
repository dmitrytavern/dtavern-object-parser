import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { isArray, isFunction, isObject } from '../utils/objects'
import { createPropertySchema } from './createPropertySchema'
import { isHandledSchema, isSchema } from './helpers'
import { metadata } from '../utils/metadata'
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
 * @public
 */
export const createSchema = <SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> => {
	validateRawSchema(rawSchema)

	const store = useHandlerStore()
	const _rawSchema = isArray(rawSchema)
		? generateRawSchemaByPaths(rawSchema)
		: (rawSchema as RawSchemaAsObject)

	const result = parseSchemaObject(_rawSchema, store)

	handler.validate(store)

	handler.clear(store)

	return result
}

export const useSchema = <SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> =>
	isSchema(rawSchema)
		? (rawSchema as any)
		: createSchema(rawSchema as RawSchema)

const validateRawSchema = (rawSchema: RawSchema) => {
	if (rawSchema === null || rawSchema === undefined || !isObject(rawSchema))
		throw 'Argument is not an array or an object.'
}

const parseSchemaObject = (
	schema: RawSchemaAsObject,
	store: HandlerStore
): any => {
	try {
		if (isHandledSchema(schema)) return schema as Schema<any>

		handler.handle(store, schema)

		const schemaCopy = {}

		metadata.set(schemaCopy, 'isSchema', true)
		metadata.set(schemaCopy, 'isPropertySchema', false)
		metadata.set(schemaCopy, 'isHandledSchema', true)

		for (const propertyKey in schema) {
			handler.set(store, propertyKey)

			parseSchemaProperty(schema, schemaCopy, propertyKey, store)

			handler.unset(store)
		}

		return Object.freeze(schemaCopy)
	} catch (e: any) {
		handler.error(store, e)
	}
}

const parseSchemaProperty = (
	readonlyObject: NonNullable<ReadonlyObject>,
	writableObject: WritableObject,
	key: PropertyKey,
	store: HandlerStore
) => {
	const property = readonlyObject[key]

	if (property === null || isFunction(property) || isArray(property)) {
		writableObject[key] = createPropertySchema({
			type: property,
		})

		return
	}

	if (isObject(property)) {
		writableObject[key] = parseSchemaObject(property, store)
		return
	}

	handler.error(store, 'property is not function, array or object')
}

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
