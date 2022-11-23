import { Config, Schema } from '@types'
import { isObject, isArray } from './utils'
import { parseOptionsByArray } from './parseOptionsByArray'
import { parseOptionsByObject } from './parseOptionsByObject'

export function parseOptions<Options, Return extends Required<Options>>(
	options: Options,
	schema: Schema<Options>,
	config?: Config
): Return {
	try {
		if (!(options && schema))
			throw (
				'first or second argument is not defined. ' +
				'The first argument must be an object and the ' +
				'second argument must be an array or object'
			)

		if (isArray(options) || !isObject(options))
			throw 'the first argument is not an object. Please, use the type of object'

		if (isArray(schema)) {
			parseOptionsByArray(options, schema)
			// @ts-ignore
			return options as Return
		}

		if (isObject(schema)) {
			const optionsCopy = config && config.clone ? {} : options

			parseOptionsByObject(options, optionsCopy, schema)
			return optionsCopy as Return
		}

		throw 'the second argument is not an object or array'
	} catch (e) {
		const mode = config && config.mode ? config.mode : 'strict'
		const errors = isArray(e) ? e : [e]
		const error = new Error('\n  ' + errors.join('\n  '))

		if (mode === 'log') console.error(error)
		if (mode === 'strict') throw error
		if (mode !== 'log') console.warn('You disable logger in options parser!')
	}
}
