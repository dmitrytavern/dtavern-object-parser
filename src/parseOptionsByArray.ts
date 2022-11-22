import { SchemaAsArray } from '@types'

export const parseOptionsByArray = <Options, Return = Required<Options>>(
	options: Options,
	schema: SchemaAsArray<Options>
): Return => {
	const errorOptionKeys = []

	for (const optionKey in options) {
		const index = schema.indexOf(optionKey)

		if (index === -1) errorOptionKeys.push(optionKey)

		schema.splice(index, 1)
	}

	if (schema.length > 0) {
		const s = schema.join(' | ')
		throw `options "${s}" not found`
	}

	if (errorOptionKeys.length > 0) {
		const s = errorOptionKeys.join(' | ')
		throw `settings for "${s}" options not found`
	}

	// @ts-ignore
	return options as Return
}
