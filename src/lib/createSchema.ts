import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { isArray, isObject, isUndefined } from '../utils/shared'
import { isHandledSchema, isSchema } from '../utils/schema'
import { createPropertySchema } from './createPropertySchema'
import { isConstructors } from 'src/utils/constructors'
import { ParserError } from 'src/utils/errors'
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
 * @public
 */
export const createSchema = <SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> => {
	try {
		validateRawSchema(rawSchema)

		const store = useHandlerStore()
		const _rawSchema = isArray(rawSchema)
			? generateRawSchemaByPaths(rawSchema)
			: (rawSchema as RawSchemaAsObject)

		const result = parseSchemaObject(_rawSchema, store)

		handler.validate(store)

		handler.clear(store)

		return result
	} catch (error) {
		throw error
	}
}

export const useSchema = <SRaw extends RawSchema>(
	rawSchema: SRaw
): Schema<SRaw> =>
	isSchema(rawSchema)
		? (rawSchema as any)
		: createSchema(rawSchema as RawSchema)

const validateRawSchema = (rawSchema: RawSchema) => {
	if (isUndefined(rawSchema) || !isObject(rawSchema))
		throw new ParserError(
			`The property schema argument must be an array or an object.`
		)
}

const parseSchemaObject = (
	schema: RawSchemaAsObject,
	store: HandlerStore
): any => {
	try {
		if (isHandledSchema(schema)) return schema as Schema<any>

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
		new ParserError('The property must be a function, an array or an object.')
	)
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
