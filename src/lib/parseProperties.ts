import { useConfig, PropertiesConfig, RequiredConfig } from '../utils/config'
import { handler, useHandlerStore, HandlerStore } from '../utils/handler'
import { hasOwn, isArray, isObject, isUndefined } from '../utils/shared'
import { parseProperty } from './parseProperty'
import { useSchema } from './createSchema'
import { isSchema, isPropertySchema, isArrayTypeSchema } from '../utils/schema'
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
 * @public
 */
export function parseProperties<S extends Schema | RawSchema>(
	object: ReadonlyObject,
	schema: PropertiesSchema,
	config?: PropertiesConfig
): SchemaReturn<S> {
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

	handler.validate(store)

	handler.clear(store)

	return writableObject as any
}

function handlePropertiesBySchema(
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	schema: Schema,
	store: HandlerStore,
	config: RequiredConfig
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
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertySchema: Schema,
	store: HandlerStore,
	config: RequiredConfig
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
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertyKey: string,
	schema: Schema,
	store: HandlerStore,
	config: RequiredConfig
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
	readonlyObject: ReadonlyObject,
	writableObject: WritableObject,
	propertyKey: string,
	propertySchema: PropertySchema,
	store: HandlerStore,
	config: RequiredConfig
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
				propertySchema['element'],
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
	readonlyObject: ReadonlyObject,
	config: RequiredConfig
): WritableObject => {
	if (isUndefined(readonlyObject)) config.clone = true

	if (config.clone) return {}

	if (isObject(readonlyObject)) return readonlyObject as object

	throw 'Object is not null | undefined | object type'
}

const validateReadonlyObject = (obj: ReadonlyObject) => {
	if (isUndefined(obj)) return

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
