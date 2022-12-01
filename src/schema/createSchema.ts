import { getMetadata, hasMetadata, setMetadata } from '../utils/metadata'
import { isArray, isFunction, isObject } from '../utils/objects'
import { createSchemaProperty } from './createSchemaProperty'
import {
	Schema,
	RawSchema,
	RawSchemaAsArray,
	RawSchemaAsObject,
	OptionTypeSetting,
} from '@types'

export const isSchema = (object: object): boolean =>
	hasMetadata(object) ? getMetadata(object, 'isSchema') : false

export const createSchema = (schema: RawSchema): Schema => {
	if (!schema) throw 'Argument is not defined.'

	if (isArray(schema)) {
		return parseSchemaArray(schema)
	}

	if (isObject(schema)) {
		return parseSchemaObject(schema)
	}

	throw 'Argument is not an array or an object.'
}

const parseSchemaArray = (rawArraySchema: RawSchemaAsArray): Schema => {
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

const parseSchemaObject = (schema: RawSchemaAsObject): Schema => {
	if (hasMetadata(schema)) return schema as Schema

	const schemaCopy = {}

	const properties = Object.keys(schema)

	setMetadata(schemaCopy, 'isSchema', true)
	setMetadata(schemaCopy, 'isSettings', false)
	setMetadata(schemaCopy, 'properties', properties)

	for (const propertyKey of properties) {
		const property = schema[propertyKey]

		if (isFunction(property) || isArray(property) || property === null) {
			schemaCopy[propertyKey] = createSchemaProperty({
				type: property as OptionTypeSetting<any>,
			})

			continue
		}

		if (isObject(property)) {
			schemaCopy[propertyKey] = parseSchemaObject(property as RawSchemaAsObject)

			continue
		}

		throw 'Schema is not function, array or object'
	}

	return Object.freeze(schemaCopy)
}
