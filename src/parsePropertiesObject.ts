/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	SchemaObject,
	SchemaPropertySettings,
	SchemaPropertyTypes,
} from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isSchemaProperty, settingsFlagName } from './schema'
import { isEqualConstructor } from './isEqualConstructor'

export const parsePropertiesObject = <Props, Return = Required<Props>>(
	properties: Props,
	propertiesSchemas: SchemaObject<Props>
): Return => {
	const errorSchemaKeys = []

	if (isArray(properties)) throw `Object is array, but need object`

	if (!isObject(properties)) throw `Object is not object. Value: ${properties}`

	for (const propertyKey in properties) {
		if (!hasOwn(propertiesSchemas, propertyKey))
			errorSchemaKeys.push(propertyKey)
	}

	if (errorSchemaKeys.length > 0) {
		const s = errorSchemaKeys.join(' | ')
		throw `Schema for "${s}" options not found`
	}

	for (const propertyKey in propertiesSchemas) {
		const propertySchema = propertiesSchemas[propertyKey]
		let propertyValue = properties[propertyKey]
		let propertyExists = hasOwn(properties, propertyKey)

		if (!isArray(propertySchema) && isObject(propertySchema)) {
			if (!isSchemaProperty(propertySchema)) {
				parsePropertiesObject(propertyValue, propertySchema as any)
				continue
			}

			for (const key of Object.keys(propertySchema))
				if (
					![
						'type',
						'required',
						'default',
						'validator',
						settingsFlagName,
					].includes(key)
				)
					throw `unknown Schema key "${key}" in "${propertyKey}"`
		}

		const type =
			propertySchema === null
				? null
				: isArray(propertySchema)
				? propertySchema
				: isObject(propertySchema)
				? (propertySchema as SchemaPropertySettings<any>).type || null
				: (propertySchema as SchemaPropertyTypes<any>)

		const required =
			propertySchema !== null && hasOwn(propertySchema, 'required')
				? propertySchema['required']
				: true

		const defaultValue =
			propertySchema !== null && hasOwn(propertySchema, 'default')
				? propertySchema['default']
				: null

		const validator =
			propertySchema !== null && hasOwn(propertySchema, 'validator')
				? propertySchema['validator']
				: null

		/**
		 * Exists checker
		 * -------------------------------------------------------
		 * Checking if property does not exist in options and this
		 * option is required - throw error.
		 */
		if (!propertyExists && required) throw `option "${propertyKey}" not exists`

		/**
		 * Default setter
		 * -------------------------------------------------------
		 * Checking If the property does not exist in options,
		 * set default value, if it exists in the Schema
		 */
		if (!propertyExists && defaultValue !== null) {
			properties[propertyKey] = isFunction(defaultValue)
				? defaultValue.apply(null)
				: defaultValue

			propertyExists = true
			propertyValue = properties[propertyKey]
		}

		/**
		 * Type option checker
		 * -------------------------------------------------------
		 * Checking if the option type is correct.
		 */
		if (type !== null) {
			const _classes = isArray(type) ? type : [type]

			for (const _class of _classes)
				if (!isFunction(_class))
					throw `type of "${propertyKey}" Schema have no function type. No-function: ${_class}`
		}

		/**
		 * Type checker
		 * -------------------------------------------------------
		 * Checking If the property does exist, check property types
		 * form Schema
		 */
		if (type !== null && propertyExists) {
			if (!isEqualConstructor(propertyValue, type)) {
				const constructors = isArray(type)
					? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
					: type.prototype.constructor.name

				throw `option "${propertyKey}" is not "${constructors}" type`
			}
		}

		/**
		 * Validator
		 * -------------------------------------------------------
		 * If Schema have custom validator, call this function
		 */
		if (propertyExists && validator !== null) {
			if (!validator.call(null, propertyValue))
				throw `option "${propertyKey}" did not pass the validator. Value: ${propertyValue}`
		}
	}

	// @ts-ignore
	return properties as Return
}
