/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionProperties, OptionProperty, OptionPropertyTypes } from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isEqualConstructor } from './isEqualConstructor'

export const parsePropertiesObject = <Props, Return = Required<Props>>(
	properties: Props,
	propertiesSettings: OptionProperties<Props>
): Return => {
	const errorSettingKeys = []

	for (const propertyKey in properties) {
		if (!hasOwn(propertiesSettings, propertyKey))
			errorSettingKeys.push(propertyKey)
	}

	if (errorSettingKeys.length > 0) {
		const s = errorSettingKeys.join(' | ')
		throw `settings for "${s}" options not found`
	}

	for (const propertyKey in propertiesSettings) {
		const propertySetting = propertiesSettings[propertyKey]
		let propertyValue = properties[propertyKey]
		let propertyExists = hasOwn(properties, propertyKey)

		const type =
			propertySetting === null
				? null
				: isArray(propertySetting)
				? propertySetting
				: isObject(propertySetting)
				? (propertySetting as OptionProperty<any>).type || null
				: (propertySetting as OptionPropertyTypes<any>)

		const required =
			propertySetting !== null && hasOwn(propertySetting, 'required')
				? propertySetting['required']
				: true

		const defaultValue =
			propertySetting !== null && hasOwn(propertySetting, 'default')
				? propertySetting['default']
				: null

		const validator =
			propertySetting !== null && hasOwn(propertySetting, 'validator')
				? propertySetting['validator']
				: null

		/**
		 * Exists checker
		 * -------------------------------------------------------
		 * Checking if property does not exist in options and this
		 * option is required - throw error.
		 */
		if (!propertyExists && required) throw `option "${propertyKey}" not exists`

		/**
		 * Default setter
		 * -------------------------------------------------------
		 * Checking If the property does not exist in options,
		 * set default value, if it exists in the setting
		 */
		if (!propertyExists && defaultValue !== null) {
			properties[propertyKey] = isFunction(defaultValue)
				? defaultValue.apply(null)
				: defaultValue

			propertyExists = true
			propertyValue = properties[propertyKey]
		}

		/**
		 * Type option checker
		 * -------------------------------------------------------
		 * Checking if the option type is correct.
		 */
		if (type !== null) {
			const _classes = isArray(type) ? type : [type]

			for (const _class of _classes)
				if (!isFunction(_class))
					throw `type of "${propertyKey}" setting have no function type. No-function: ${_class}`
		}

		/**
		 * Type checker
		 * -------------------------------------------------------
		 * Checking If the property does exist, check property types
		 * form setting
		 */
		if (type !== null && propertyExists) {
			if (!isEqualConstructor(propertyValue, type)) {
				const constructors = isArray(type)
					? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
					: type.prototype.constructor.name

				throw `option "${propertyKey}" is not "${constructors}" type`
			}
		}

		/**
		 * Validator
		 * -------------------------------------------------------
		 * If setting have custom validator, call this function
		 */
		if (propertyExists && validator !== null) {
			if (!validator.call(null, propertyValue))
				throw `option "${propertyKey}" did not pass the validator. Value: ${propertyValue}`
		}
	}

	// @ts-ignore
	return properties as Return
}
