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
import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { useSchema } from '../schema/createSchema'
import { Props, ReadonlyProps, WritableProps } from '@types'

export type PropsConfig = null | undefined | Config

/**
 * @public
 */
export function parseProperties<PropsSchema extends RawSchema | Schema>(
	_object: Props,
	_schema: PropsSchema,
	_config?: PropsConfig
): SchemaReturn<PropsSchema> {
	const config = useConfig(_config)
	const schema = useSchema(_schema)
	const readonlyObject = _object
	const writableObject = useWritableObject(readonlyObject, config)
	const store = useHandlerStore()

	handlePropertiesBySchema(
		readonlyObject,
		writableObject,
		schema,
		store,
		config
	)

	handler.validate(store)

	handler.clear(store)

	return writableObject as SchemaReturn<PropsSchema>
}

function handlePropertiesBySchema(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	schema: Schema,
	store: HandlerStore,
	config: Required<Config>
) {
	try {
		validateReadonlyObject(readonlyObject)

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
	} catch (e: any) {
		handler.error(store, e)
	}
}

function handlePropertiesByOneSchema(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	propertySchema: Schema,
	store: HandlerStore,
	config: Required<Config>
) {
	if (!readonlyObject) return

	try {
		handler.handle(store, writableObject)

		for (const propertyKey in readonlyObject) {
			handler.set(store, propertyKey)

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
	} catch (e: any) {
		handler.error(store, e)
	}
}

function handleProperty(
	readonlyObject: ReadonlyProps,
	writableObject: WritableProps,
	propertyKey: string,
	schema: Schema,
	store: HandlerStore,
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
			store,
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
			store,
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
	store: HandlerStore,
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
				store,
				config
			)
			return
		}
	} catch (e: any) {
		handler.error(store, e)
	}
}

// Helpers

const useWritableObject = (
	readonlyObject: ReadonlyProps,
	config: Required<Config>
): WritableProps => {
	if (readonlyObject === undefined || readonlyObject === null)
		config.clone = true

	if (config.clone) return {}

	if (isObject(readonlyObject)) return readonlyObject as object

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
