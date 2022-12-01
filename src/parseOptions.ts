import { Config, Schema, SchemaReturn, RawSchema } from '@types'
import { createSchema, isSchema } from './schema/createSchema'
import { isObject, isArray } from './utils/objects'
import { parseObject } from './parseObject'

export function parseOptions<
	OptionsSchema extends Schema | RawSchema,
	Return = SchemaReturn<OptionsSchema>
>(options: any, schema: OptionsSchema, config?: Config): Return {
	try {
		if (!(options && schema))
			throw (
				'first or second argument is not defined. ' +
				'The first argument must be an object and the ' +
				'second argument must be object schema'
			)

		if (isArray(options) || !isObject(options))
			throw 'the first argument is not an object.'

		if (!isArray(schema) && !isObject(schema))
			throw 'the second argument is not an object or an array.'

		const optionsCopy = config && config.clone ? {} : options
		const _schema =
			isArray(schema) || !isSchema(schema)
				? createSchema(schema)
				: (schema as Schema)

		parseObject(options, optionsCopy, _schema)

		return optionsCopy as any
	} catch (e) {
		const mode = config && config.mode ? config.mode : 'strict'
		const errors = isArray(e) ? e : [e]
		const error = new Error('\n  ' + errors.join('\n  '))

		if (mode === 'log') console.error(error)
		if (mode === 'strict') throw error
		if (mode !== 'log') console.warn('You disable logger in options parser!')
	}
}
