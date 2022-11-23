/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchemaAsObject } from '@types'
import { hasOwn, isArray, isObject } from './utils'
import { isSchemaProperty } from './schema'
import { parseValue } from './parseValue'

const _nestedLogs = []
const _errorLogs = []

export const parseOptionsByObject = <Options>(
	options: Options,
	schema: SchemaAsObject<Options>
): void => {
	_nestedLogs.length = 0
	_errorLogs.length = 0

	parseOptionsBySchema(options, schema)

	if (_errorLogs.length > 0) {
		throw _errorLogs
	}
}

const parseOptionsBySchema = <Options>(
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
		const path = _nestedLogs.length === 0 ? 'root' : _nestedLogs.join('.')
		_errorLogs.push(`in ${path} for "${s}" key of options not found in scheme`)
		return
	}

	for (const schemaKey in schema) {
		parseOption(options, schema, schemaKey)
	}
}

const parseOption = <Options>(
	optionsParent: Options,
	schemaParent: SchemaAsObject<Options>,
	optionKey: string
): void => {
	_nestedLogs.push(optionKey)

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

		_nestedLogs.pop()

		return
	}

	parseOptionValue(optionsParent, schemaParent, optionKey)

	_nestedLogs.pop()
}

const parseOptionValue = <Options>(
	optionsParent: Options,
	schemaParent: SchemaAsObject<Options>,
	optionKey: string
): void => {
	try {
		const optionExists = hasOwn(optionsParent, optionKey)

		const optionValue = parseValue(
			optionsParent[optionKey],
			schemaParent[optionKey],
			optionExists
		)

		if (optionExists && optionValue === undefined)
			optionsParent[optionKey] = optionValue

		if (optionValue !== undefined) optionsParent[optionKey] = optionValue
	} catch (error) {
		_errorLogs.push(`in ${_nestedLogs.join('.')}: ${error}`)
	}
}
