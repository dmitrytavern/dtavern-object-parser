import { OptionSettings, OptionProperty } from '@types'
import { hasOwn, isArray, isFunction, isObject } from './utils'
import {
	verifyPropertyValue,
	verifyPropertyExists,
	verifyPropertiesExists,
} from './verifiers/index'

export function defineOptions<Properties>(
	properties: Properties,
	propertiesSettings: OptionSettings<Properties>
): Required<Properties> {
	if (!(properties && propertiesSettings))
		throw new Error('First or second function argument is not defined')

	if (!isObject(properties))
		throw new Error('Properties is not object argument')

	if (isArray(propertiesSettings)) {
		verifyPropertiesExists(properties, propertiesSettings)

		// @ts-ignore
		return properties
	}

	if (isObject(propertiesSettings)) {
		for (const settingKey in propertiesSettings) {
			const propertyValue = properties[settingKey]
			const propertySetting = propertiesSettings[
				settingKey
			] as OptionProperty<any>

			if (propertySetting === null) continue

			verifyPropertyExists(properties, settingKey, propertySetting)

			// @ts-ignore
			if (hasOwn(properties, settingKey)) {
				verifyPropertyValue(settingKey, propertyValue, propertySetting)
			} else if (hasOwn(propertySetting, 'default')) {
				if (isFunction(propertySetting.default)) {
					properties[settingKey] = propertySetting.default.apply(null)
				} else {
					properties[settingKey] = propertySetting.default
				}
			}
		}

		// @ts-ignore
		return properties
	}

	throw new Error('Settings is not array or object.')
}
