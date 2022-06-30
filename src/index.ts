import { OptionSettings } from '@types'
import { isObject } from './utils'

import { parseProperties } from './parseProperties'

export function defineOptions<Properties>(
	properties: Properties,
	propertiesSettings: OptionSettings<Properties>
): Required<Properties> {
	if (!(properties && propertiesSettings))
		throw new Error('First or second function argument is not defined')

	if (!isObject(properties))
		throw new Error('Properties is not object argument')

	return parseProperties(properties, propertiesSettings)
}
