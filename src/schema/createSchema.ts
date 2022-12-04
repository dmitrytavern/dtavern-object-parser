import { getMetadata, hasMetadata, setMetadata } from '../utils/metadata'
import { isArray, isFunction, isObject } from '../utils/objects'
import { createSchemaProperty } from './createSchemaProperty'
import { Schema, RawSchema, PropertyType } from '@types'

export const isSchema = (obj: any): boolean =>
	hasMetadata(obj) ? getMetadata(obj, 'isSchema') : false

export const createSchema = <RawSchemaObject extends RawSchema>(
	schema: RawSchemaObject
): Schema<RawSchemaObject> => {
	if (!schema) throw 'Argument is not defined.'

	if (isArray(schema)) {
		return parseSchemaArray(schema)
	}

	if (isObject(schema)) {
		return parseSchemaObject(schema)
	}

	throw 'Argument is not an array or an object.'
}

const parseSchemaArray = (rawArraySchema: string[]): any => {
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

	return parseSchemaObject(rawObjectSchema)
}

const parseSchemaObject = (schema: object): any => {
	if (hasMetadata(schema)) return schema as Schema<any>

	const schemaCopy = {}

	const properties = Object.keys(schema)

	setMetadata(schemaCopy, 'isSchema', true)
	setMetadata(schemaCopy, 'isSettings', false)
	setMetadata(schemaCopy, 'properties', properties)

	for (const propertyKey of properties) {
		const property = schema[propertyKey]

		if (isFunction(property) || isArray(property) || property === null) {
			schemaCopy[propertyKey] = createSchemaProperty({
				type: property as PropertyType,
			})

			continue
		}

		if (isObject(property)) {
			schemaCopy[propertyKey] = parseSchemaObject(property)

			continue
		}

		throw 'Schema is not function, array or object'
	}

	return Object.freeze(schemaCopy)
}
