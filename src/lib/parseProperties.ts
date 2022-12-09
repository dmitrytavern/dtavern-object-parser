import {
	Schema,
	RawSchema,
	Config,
	SchemaReturn,
	PropertyOptions,
} from '@types'
import { hasOwn, isArray, isObject } from '../utils/objects'
import { parseProperty } from './parseProperty'
import {
	isArrayTypeSchema,
	isPropertySchema,
	isSchema,
} from '../schema/helpers'
import { useObjectHandler, ObjectHandler } from '../utils/handlers'
import { metadata } from '../utils/metadata'
import { useSchema } from '../schema/createSchema'
import { Props, PropsSchema, ReadonlyProps, WritableProps } from './tmp'

type PropsConfig = null | undefined | Config

export function parseProperties<PropsSchema extends RawSchema | Schema>(
	_object: Props,
	_schema: PropsSchema,
	_config?: PropsConfig
): SchemaReturn<PropsSchema> {
	const config = useConfig(_config)
	const schema = useSchema(_schema)
	const readonlyObject = _object
	const writableObject = useWritableObject(_object, _schema, config)
	const handler = useObjectHandler()

	handlePropertiesBySchema(
		readonlyObject,
		writableObject,
		schema,
		handler,
		config
	)

	handler.validate()

	handler.clear()

	return writableObject as SchemaReturn<PropsSchema>
}

function handlePropertiesBySchema(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	schema: Schema,
	handler: ObjectHandler,
	config: Required<Config>
) {
	try {
		validateReadonlyObject(readonlyObject)

		validateWritableObject(writableObject, handler)

		handler.handle(writableObject)

		for (const propertyKey in schema) {
			handler.set(propertyKey)

			handleProperty(
				readonlyObject,
				writableObject,
				propertyKey,
				schema[propertyKey],
				handler,
				config
			)

			handler.unset()
		}
	} catch (e) {
		handler.addError(e)
	}
}

function handlePropertiesByOneSchema(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	propertySchema: Schema,
	handler: ObjectHandler,
	config: Required<Config>
) {
	if (!readonlyObject) return

	try {
		validateWritableObject(writableObject, handler)

		handler.handle(writableObject)

		for (const propertyKey in readonlyObject) {
			handler.set(propertyKey)

			handleProperty(
				readonlyObject,
				writableObject,
				propertyKey,
				propertySchema,
				handler,
				config
			)

			handler.unset()
		}
	} catch (e) {
		handler.addError(e)
	}
}

function handleProperty(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	propertyKey: string,
	schema: Schema,
	handler: ObjectHandler,
	config: Required<Config>
) {
	const _value = writableObject[propertyKey]

	if (isSchema(schema)) {
		if (!isObject(_value)) {
			writableObject[propertyKey] = {}
		}

		handlePropertiesBySchema(
			readonlyObject && readonlyObject[propertyKey],
			writableObject[propertyKey],
			schema,
			handler,
			config
		)

		return
	}

	if (isPropertySchema(schema)) {
		handlePropertyValue(
			readonlyObject,
			writableObject,
			propertyKey,
			schema,
			handler,
			config
		)

		return
	}

	throw 'Something went wrong: schema must be is schema or schema property'
}

function handlePropertyValue(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	propertyKey: string,
	propertySchema: PropertyOptions,
	handler: ObjectHandler,
	config: Required<Config>
) {
	try {
		parseProperty(readonlyObject, writableObject, propertyKey, propertySchema)

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
				propertySchema['typeElement'],
				handler,
				config
			)
			return
		}
	} catch (e) {
		handler.addError(e)
	}
}

// Helpers

const useWritableObject = (
	readonlyObject: ReadonlyProps,
	schema: PropsSchema,
	config: Required<Config>
): WritableProps => {
	const _isArrayType = metadata.get(schema, 'isArrayType')
	const copy = _isArrayType ? [] : {}

	if (readonlyObject === undefined || readonlyObject === null) return copy

	if (isObject(readonlyObject)) return config.clone ? copy : readonlyObject

	throw 'Object is not null | undefined | object type'
}

const useConfig = (config: PropsConfig): Required<Config> => {
	return {
		mode: config && config.mode ? config.mode : 'strict',
		clone: config && config.clone ? config.clone : false,
	}
}

const validateReadonlyObject = (obj: ReadonlyProps) => {
	if (obj === null || obj === undefined) return

	const errorKeys: string[] = []

	for (const propertyKey in obj) {
		if (!hasOwn(obj, propertyKey)) {
			errorKeys.push(propertyKey)
		}
	}

	if (errorKeys.length > 0) {
		const s = errorKeys.join(' | ')
		throw `for "${s}" key of options not found in scheme`
	}
}

const validateWritableObject = (obj: WritableProps, handler: ObjectHandler) => {
	if (handler.isHandled(obj)) throw `detected cyrcle links`
}
