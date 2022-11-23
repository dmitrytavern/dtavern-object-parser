import { SchemaAsArray } from '@types'
import { isArray, isObject } from './utils'

export const parseOptionsByArray = <Options>(
	options: Options,
	schema: SchemaAsArray<Options>
): void => {
	const optionsPaths = exportOpitonsPaths(options)
	const schemaPaths = exportSchemaPaths(schema)
	const _errorLogs = []

	for (const schemaPath of schemaPaths) {
		const index = optionsPaths.indexOf(schemaPath)

		if (index === -1) _errorLogs.push(`in ${schemaPath}: option not exists`)
		else optionsPaths.splice(index, 1)
	}

	for (const optionPath of optionsPaths)
		_errorLogs.push(`in ${optionPath}: option not exists in schema`)

	if (_errorLogs.length > 0) {
		throw _errorLogs
	}
}

const exportOpitonsPaths = <Options>(options: Options): string[] => {
	const arr = []

	for (const optionKey in options) {
		arr.push(optionKey)

		const option = options[optionKey]
		if (!isArray(option) && isObject(option)) {
			const newArr = exportOpitonsPaths(option).map((x) => optionKey + '.' + x)
			arr.push(...newArr)
		}
	}

	return arr
}

const exportSchemaPaths = <Options>(
	schema: SchemaAsArray<Options>
): string[] => {
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
