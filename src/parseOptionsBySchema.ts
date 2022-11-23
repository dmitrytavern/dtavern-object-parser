/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchemaAsObject, SchemaOptionSettings, SchemaOptionTypes } from '@types'
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
		const optionNotExists = isArray(optionValue) || !isObject(optionValue)

		if (optionNotExists) optionsParent[optionKey] = {}

		parseOptionsBySchema(optionsParent[optionKey], schemaParent[optionKey])

		if (optionNotExists && Object.keys(optionsParent[optionKey]).length == 0)
			delete optionsParent[optionKey]

		return
	}

	parseOptionValue(optionsParent, schemaParent, optionKey)
}

export const parseOptionValue = <Options>(
	optionsParent: Options,
	schemaParent: SchemaAsObject<Options>,
	optionKey: string
): void => {
	const optionExists = hasOwn(optionsParent, optionKey)

	const optionValue = parseValue(
		optionsParent[optionKey],
		schemaParent[optionKey],
		optionExists
	)

	if (optionExists && optionValue === undefined)
		optionsParent[optionKey] = optionValue

	if (optionValue !== undefined) optionsParent[optionKey] = optionValue
}

export const parseValue = <OptionValue>(
	optionValue: OptionValue,
	optionSchema: SchemaOptionSettings<OptionValue>,
	existsInParents?: boolean
): OptionValue => {
	let _optionValue = optionValue
	let _optionExists =
		existsInParents === undefined
			? optionValue !== undefined
			: !!existsInParents

	const type =
		optionSchema === null
			? null
			: isArray(optionSchema)
			? optionSchema
			: isObject(optionSchema)
			? (optionSchema as SchemaOptionSettings<any>).type || null
			: (optionSchema as SchemaOptionTypes<any>)

	const required =
		optionSchema !== null && hasOwn(optionSchema, 'required')
			? optionSchema['required']
			: true

	const defaultValue =
		optionSchema !== null && hasOwn(optionSchema, 'default')
			? optionSchema['default']
			: null

	const validator =
		optionSchema !== null && hasOwn(optionSchema, 'validator')
			? optionSchema['validator']
			: null

	/**
	 * Exists checker
	 * -------------------------------------------------------
	 * Checking if property does not exist in options and this
	 * option is required - throw error.
	 */
	if (!_optionExists && required) throw `option not exists`

	/**
	 * Default setter
	 * -------------------------------------------------------
	 * Checking If the property does not exist in options,
	 * set default value, if it exists in the Schema
	 */
	if (!_optionExists && defaultValue !== null) {
		_optionValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue

		_optionExists = true
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
				throw `type of schema have no function type. No-function: ${_class}`
	}

	/**
	 * Type checker
	 * -------------------------------------------------------
	 * Checking If the property does exist, check property types
	 * form Schema
	 */
	if (type !== null && _optionExists) {
		if (!isEqualConstructor(_optionValue, type)) {
			const constructors = isArray(type)
				? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
				: type.prototype.constructor.name

			throw `option is not "${constructors}" type`
		}
	}

	/**
	 * Validator
	 * -------------------------------------------------------
	 * If Schema have custom validator, call this function
	 */
	if (_optionExists && validator !== null) {
		if (!validator.call(null, _optionValue))
			throw `option did not pass the validator. Value: ${_optionValue}`
	}

	return _optionValue
}
