import { hasOwn } from '../utils'
import { OptionProperty } from '@types'

interface Properties {
	[key: string]: any
}

export const verifyPropertyExists = (
	properties: Properties,
	propertyKey: any,
	propertySetting: OptionProperty<any>
): boolean => {
	if (hasOwn(propertySetting, 'required')) {
		if (propertySetting.required && !hasOwn(properties, propertyKey))
			throw new Error(`Property "${propertyKey}" not exists`)
	}

	return true
}
