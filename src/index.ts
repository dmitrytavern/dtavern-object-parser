import { OptionSettings } from '@types'
import { isObject, isArray } from './utils'
import { parseProperties } from './parseProperties'

export function defineOptions<Properties>(
	properties: Properties,
	propertiesSettings: OptionSettings<Properties>
): Required<Properties> {
	try {
		if (!(properties && propertiesSettings))
			throw (
				'first or second argument is not defined. ' +
				'The first argument must be an object and the ' +
				'second argument must be an array or object'
			)

		if (isArray(properties) || !isObject(properties))
			throw 'the first argument is not an object. Please, use the type of object'

		return parseProperties(properties, propertiesSettings)
	} catch (e) {
		throw new Error(e)
	}
}
