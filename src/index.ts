import { Config, OptionSettings } from '@types'
import { isObject, isArray } from './utils'
import { parseProperties } from './parseProperties'
import { errorLog } from './errorLog'

export function defineOptions<Props, Return extends Required<Props>>(
	properties: Props,
	propertiesSettings: OptionSettings<Props>,
	config?: Config
): Return {
	try {
		if (!(properties && propertiesSettings))
			throw (
				'first or second argument is not defined. ' +
				'The first argument must be an object and the ' +
				'second argument must be an array or object'
			)

		if (isArray(properties) || !isObject(properties))
			throw 'the first argument is not an object. Please, use the type of object'

		const props = config && config.clone ? { ...properties } : properties

		return parseProperties(props, propertiesSettings)
	} catch (e) {
		errorLog(e, config ? config.mode : 'strict')
	}
}

export default defineOptions
