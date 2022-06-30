import { isArray, isObject, isFunction } from '../utils'
import { OptionProperty, OptionPropertyTypes } from '@types'

import { isEqualConstructor } from '../isEqualConstructor'

export const verifyPropertyValue = (
	propertyKey: any,
	propertyValue: any,
	propertySetting: OptionProperty<any> | OptionPropertyTypes<any>
): boolean => {
	if (isArray(propertySetting)) {
		if (!isEqualConstructor(propertyValue, propertySetting))
			throw new Error(`Property "${propertyKey}" is not "${propertySetting}"`)

		return true
	}

	if (isObject(propertySetting)) {
		propertySetting = propertySetting as OptionProperty<any>

		if (!isEqualConstructor(propertyValue, propertySetting.type))
			throw new Error(
				`Property "${propertyKey}" is not "${propertySetting.type}"`
			)

		if (isFunction(propertySetting.validator)) {
			if (!propertySetting.validator.call(null, propertyValue))
				throw new Error(`Property "${propertyKey}" did not pass the validator`)
		}

		return true
	}

	propertySetting = propertySetting as OptionPropertyTypes<any>

	if (!isEqualConstructor(propertyValue, propertySetting))
		throw new Error(`Property "${propertyKey}" is not "${propertySetting}"`)

	return true
}
