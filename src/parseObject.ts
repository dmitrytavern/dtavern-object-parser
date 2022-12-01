import { Schema } from '@types'
import { hasOwn, isArray, isObject } from './utils/objects'
import { parseValue } from './parseValue'
import { isSchema } from './schema/createSchema'

type OriginalOptions = object | undefined
type Options = object

const _nestedLogs = []
const _errorLogs = []
const _optionsWithFlags = []
const handledFlagName = '__dtavern_option_pareser__is_already_handled'

export const parseObject = (
	originalOptions: OriginalOptions,
	options: Options,
	schema: Schema
): void => {
	_nestedLogs.length = 0
	_errorLogs.length = 0
	_optionsWithFlags.length = 0

	parseOptions(originalOptions, options, schema)

	for (const object of _optionsWithFlags) delete object[handledFlagName]

	if (_errorLogs.length > 0) {
		throw _errorLogs
	}
}

const parseOptions = (
	originalOptions: OriginalOptions,
	options: Options,
	schema: Schema
): void => {
	if (hasOwn(options, handledFlagName) && options[handledFlagName]) {
		const path = _nestedLogs.length === 0 ? 'root' : _nestedLogs.join('.')
		_errorLogs.push(`in ${path} detected cyrcle links`)
		return
	}

	const errorSchemaKeys = []

	for (const propertyKey in originalOptions) {
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

	options[handledFlagName] = true
	_optionsWithFlags.push(options)

	for (const schemaKey in schema) {
		parseOption(originalOptions, options, schema, schemaKey)
	}
}

const parseOption = (
	originalOptionsParent: OriginalOptions,
	optionsParent: Options,
	schemaParent: Schema,
	optionKey: string
): void => {
	_nestedLogs.push(optionKey)

	const opitonSchema = schemaParent[optionKey]
	const optionValue = optionsParent[optionKey]

	if (isSchema(opitonSchema)) {
		const optionNotExists = isArray(optionValue) || !isObject(optionValue)

		if (optionNotExists) optionsParent[optionKey] = {}

		parseOptions(
			originalOptionsParent[optionKey],
			optionsParent[optionKey],
			schemaParent[optionKey] as Schema
		)

		if (optionNotExists && Object.keys(optionsParent[optionKey]).length <= 1)
			delete optionsParent[optionKey]

		_nestedLogs.pop()

		return
	}

	parseOptionValue(
		originalOptionsParent,
		optionsParent,
		schemaParent,
		optionKey
	)

	_nestedLogs.pop()
}

const parseOptionValue = (
	originalOptionsParent: OriginalOptions,
	optionsParent: Options,
	schemaParent: Schema,
	optionKey: string
): void => {
	try {
		const optionExists = originalOptionsParent
			? hasOwn(originalOptionsParent, optionKey)
			: false

		if (optionExists)
			optionsParent[optionKey] = originalOptionsParent[optionKey]

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