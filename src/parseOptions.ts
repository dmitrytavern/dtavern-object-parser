import { Config, Schema } from '@types'
import { isObject, isArray } from './utils'
import { parseOptionsByArray } from './parseOptionsByArray'
import { parseOptionsBySchema } from './parseOptionsBySchema'
import { errorLog } from './errorLog'

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

		const props = config && config.clone ? { ...options } : options

		if (isArray(schema)) {
			return parseOptionsByArray(props, schema)
		}

		if (isObject(schema)) {
			return parseOptionsBySchema(props, schema)
		}

		throw 'the second argument is not an object or array'
	} catch (e) {
		errorLog(e, config ? config.mode : 'strict')
	}
}
