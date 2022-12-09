import { Schema, RawSchema, PropertyType } from '@types'
import { useObjectHandler, ObjectHandler } from '../utils/handlers'
import { isArray, isFunction, isObject } from '../utils/objects'
import { createPropertySchema } from './createPropertySchema'
import { isHandledSchema, isSchema } from './helpers'
import { metadata } from '../utils/metadata'

/**
 * @public
 */
export const createSchema = <RawSchemaObject extends RawSchema>(
	rawSchema: RawSchemaObject
): Schema<RawSchemaObject> => {
	validateRawSchema(rawSchema)

	const handler = useObjectHandler()
	const _rawSchema = isArray(rawSchema)
		? generateRawSchemaByPaths(rawSchema)
		: rawSchema

	const result = parseSchemaObject(_rawSchema, handler)

	handler.validate()

	handler.clear()

	return result
}

export const useSchema = <RawSchemaObject extends RawSchema | Schema>(
	rawSchema: RawSchemaObject
): Schema<RawSchemaObject> =>
	isSchema(rawSchema)
		? (rawSchema as any)
		: createSchema(rawSchema as RawSchema)

const validateRawSchema = (rawSchema: RawSchema) => {
	if (rawSchema === null || rawSchema === undefined || !isObject(rawSchema))
		throw 'Argument is not an array or an object.'
}

const parseSchemaObject = (schema: object, handler: ObjectHandler): any => {
	if (isHandledSchema(schema)) return schema as Schema<any>
	if (handler.isHandled(schema)) {
		handler.addError('detected cycle links')
		return schema
	}

	handler.handle(schema)

	const schemaCopy = {}

	metadata.set(schemaCopy, 'isSchema', true)
	metadata.set(schemaCopy, 'isPropertySchema', false)
	metadata.set(schemaCopy, 'isHandledSchema', true)

	for (const propertyKey in schema) {
		handler.set(propertyKey)

		schemaCopy[propertyKey] = parseSchemaProperty(schema, propertyKey, handler)

		handler.unset()
	}

	return Object.freeze(schemaCopy)
}

const parseSchemaProperty = (
	schema: object,
	key: string | number,
	handler: ObjectHandler
) => {
	const property = schema[key]

	if (property === null || isFunction(property) || isArray(property)) {
		return createPropertySchema({
			type: property as PropertyType,
		})
	}

	if (isObject(property)) {
		return parseSchemaObject(property, handler)
	}

	handler.addError('property is not function, array or object')

	return undefined
}

const generateRawSchemaByPaths = (rawArraySchema: string[]): any => {
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
