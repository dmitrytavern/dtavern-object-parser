/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	SchemaAsObject,
	SchemaPropertySettings,
	SchemaPropertyTypes,
} from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isEqualConstructor } from './isEqualConstructor'
import { isSchemaProperty } from './schema'

export const parseOptionsBySchema = <Options>(
	options: Options,
	schema: SchemaAsObject<Options>
): void => {
	const errorSchemaKeys = []

	for (const propertyKey in options) {
		if (!hasOwn(schema, propertyKey)) {
			errorSchemaKeys.push(propertyKey)
		}
	}

	if (errorSchemaKeys.length > 0) {
		const s = errorSchemaKeys.join(' | ')
		throw `Schema for "${s}" options not found`
	}

	for (const schemaKey in schema) {
		parseOption(options, schema, schemaKey)
	}
}

export const parseOption = <Options>(
	optionsParent: Options,
	schemaParent: SchemaAsObject<Options>,
	optionKey: string
): void => {
	const opitonSchema = schemaParent[optionKey]
	const optionValue = optionsParent[optionKey]

	if (
		!isArray(opitonSchema) &&
		isObject(opitonSchema) &&
		!isSchemaProperty(opitonSchema)
	) {
		if (isArray(optionValue) || !isObject(optionValue)) {
			throw `option "${optionKey}" is not object`
		}

		parseOptionsBySchema(optionValue, opitonSchema)
		return
	}

	parseOptionValue(optionsParent, schemaParent, optionKey)
}

export const parseOptionValue = <Options>(
	optionsParent: Options,
	schemaParent: SchemaAsObject<Options>,
	optionKey: string
): void => {
	const propertySchema = schemaParent[optionKey]
	let optionValue = optionsParent[optionKey]
	let optionExists = hasOwn(optionsParent, optionKey)

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
	if (!optionExists && required) throw `option "${optionKey}" not exists`

	/**
	 * Default setter
	 * -------------------------------------------------------
	 * Checking If the property does not exist in options,
	 * set default value, if it exists in the Schema
	 */
	if (!optionExists && defaultValue !== null) {
		optionsParent[optionKey] = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue

		optionExists = true
		optionValue = optionsParent[optionKey]
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
				throw `type of "${optionKey}" schema have no function type. No-function: ${_class}`
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

			throw `option "${optionKey}" is not "${constructors}" type`
		}
	}

	/**
	 * Validator
	 * -------------------------------------------------------
	 * If Schema have custom validator, call this function
	 */
	if (optionExists && validator !== null) {
		if (!validator.call(null, optionValue))
			throw `option "${optionKey}" did not pass the validator. Value: ${optionValue}`
	}
}
