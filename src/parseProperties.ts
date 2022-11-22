import { Schema } from '@types'
import { isArray, isObject } from './utils'
import { parsePropertiesArray } from './parsePropertiesArray'
import { parsePropertiesObject } from './parsePropertiesObject'

export const parseProperties = <Props, Return = Required<Props>>(
	properties: Props,
	propertiesSchema: Schema<Props>
): Return => {
	if (isArray(propertiesSchema)) {
		// @ts-ignore
		return parsePropertiesArray(properties, propertiesSchema)
	}

	if (isObject(propertiesSchema)) {
		return parsePropertiesObject(properties, propertiesSchema)
	}

	throw 'the second argument is not an object or array'
}
