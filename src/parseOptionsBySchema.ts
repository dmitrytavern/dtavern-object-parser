/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	SchemaAsObject,
	SchemaPropertySettings,
	SchemaPropertyTypes,
} from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isEqualConstructor } from './isEqualConstructor'
import { isSchemaProperty } from './schema'

export const parseOptionsBySchema = <Options, Return = Required<Options>>(
	options: Options,
	schema: SchemaAsObject<Options>
): Return => {
	const errorSchemaKeys = []

	if (isArray(options)) throw `Options is array, but need object`

	if (!isObject(options)) throw `Options is not object. Value: ${options}`

	for (const propertyKey in options) {
		if (!hasOwn(schema, propertyKey)) errorSchemaKeys.push(propertyKey)
	}

	if (errorSchemaKeys.length > 0) {
		const s = errorSchemaKeys.join(' | ')
		throw `Schema for "${s}" options not found`
	}

	for (const schemaKey in schema) {
		const propertySchema = schema[schemaKey]
		let optionValue = options[schemaKey]
		let optionExists = hasOwn(options, schemaKey)

		if (!isArray(propertySchema) && isObject(propertySchema)) {
			if (!isSchemaProperty(propertySchema)) {
				parseOptionsBySchema(optionValue, propertySchema as any)
				continue
			}
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
		if (!optionExists && required) throw `option "${schemaKey}" not exists`

		/**
		 * Default setter
		 * -------------------------------------------------------
		 * Checking If the property does not exist in options,
		 * set default value, if it exists in the Schema
		 */
		if (!optionExists && defaultValue !== null) {
			options[schemaKey] = isFunction(defaultValue)
				? defaultValue.apply(null)
				: defaultValue

			optionExists = true
			optionValue = options[schemaKey]
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
					throw `type of "${schemaKey}" schema have no function type. No-function: ${_class}`
		}

		/**
		 * Type checker
		 * -------------------------------------------------------
		 * Checking If the property does exist, check property types
		 * form Schema
		 */
		if (type !== null && optionExists) {
			if (!isEqualConstructor(optionValue, type)) {
				const constructors = isArray(type)
					? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
					: type.prototype.constructor.name

				throw `option "${schemaKey}" is not "${constructors}" type`
			}
		}

		/**
		 * Validator
		 * -------------------------------------------------------
		 * If Schema have custom validator, call this function
		 */
		if (optionExists && validator !== null) {
			if (!validator.call(null, optionValue))
				throw `option "${schemaKey}" did not pass the validator. Value: ${optionValue}`
		}
	}

	// @ts-ignore
	return options as Return
}
