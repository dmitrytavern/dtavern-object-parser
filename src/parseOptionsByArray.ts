import { SchemaAsArray } from '@types'
import { hasOwn, isArray, isObject } from '@utilities'

type Options = object

const _errorLogs = []
const _optionsWithFlag = []
const handledFlagName = '__dtavern_option_pareser__is_already_handled'

export const parseOptionsByArray = (
	options: Options,
	schema: SchemaAsArray
): void => {
	_errorLogs.length = 0
	_optionsWithFlag.length = 0

	const optionsPaths = exportOpitonsPaths(options)
	const schemaPaths = exportSchemaPaths(schema)

	for (const schemaPath of schemaPaths) {
		const index = optionsPaths.indexOf(schemaPath)

		if (index === -1) _errorLogs.push(`in ${schemaPath}: option not exists`)
		else optionsPaths.splice(index, 1)
	}

	for (const optionPath of optionsPaths)
		_errorLogs.push(`in ${optionPath}: option not exists in schema`)

	for (const object of _optionsWithFlag) delete object[handledFlagName]

	if (_errorLogs.length > 0) {
		throw _errorLogs
	}
}

const exportOpitonsPaths = (options: Options): string[] => {
	const arr = []

	if (hasOwn(options, handledFlagName) && options[handledFlagName]) {
		_errorLogs.push('detected cycle links')
		return
	}

	options[handledFlagName] = true
	_optionsWithFlag.push(options)

	for (const optionKey in options) {
		if (optionKey === handledFlagName) continue

		arr.push(optionKey)

		const option = options[optionKey]
		if (!isArray(option) && isObject(option)) {
			const newArr = exportOpitonsPaths(option).map((x) => optionKey + '.' + x)
			arr.push(...newArr)
		}
	}

	return arr
}

const exportSchemaPaths = (schema: SchemaAsArray): string[] => {
	const arr = []

	for (const schemaFullPath of schema as string[]) {
		const schemaPath = schemaFullPath.split('.')
		const tmpPath = []

		for (const key of schemaPath) {
			tmpPath.push(key)

			const newPath = tmpPath.join('.')

			if (arr.indexOf(newPath) === -1) arr.push(newPath)
		}
	}

	return arr
}
