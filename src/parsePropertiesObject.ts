/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionProperties, OptionProperty, OptionPropertyTypes } from '@types'
import { hasOwn, isFunction, isArray, isObject } from './utils'
import { isEqualConstructor } from './isEqualConstructor'

export const parsePropertiesObject = <Properties>(
	properties: Properties,
	propertiesSettings: OptionProperties<Properties>
): Required<Properties> => {
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

		/**
		 * If property setting is null, skip other checkers
		 */
		if (propertySetting === null) continue

		/**
		 * If property setting is object, and this object have no
		 * type option or type is wrong - throw error
		 */
		if (!isArray(propertySetting) && isObject(propertySetting)) {
			if (!hasOwn(propertySetting, 'type'))
				throw `setting "${propertyKey}" have no "type" option`

			const type = (propertySetting as OptionProperty<any>).type

			if (type !== null) {
				const _classes = isArray(type) ? type : [type]

				for (const _class of _classes)
					if (!isFunction(_class))
						throw `type of "${propertyKey}" setting have no function type. No-function: ${_class}`
			}
		}

		/**
		 * If property setting have false required option,
		 * skip checker of exists in properties
		 */
		if (!propertyExists && hasOwn(propertySetting, 'required'))
			if (propertySetting['required'])
				throw `option "${propertyKey}" not exists`

		/**
		 * If property not exists, set default value, if it exists
		 * in setting
		 */
		if (!propertyExists && hasOwn(propertySetting, 'default')) {
			const settings = propertySetting as OptionProperty<any>

			properties[propertyKey] = isFunction(settings.default)
				? settings.default.apply(null)
				: settings.default

			propertyExists = true
			propertyValue = properties[propertyKey]
		}

		/**
		 * If property exists, check property types form
		 * setting
		 */
		if (propertyExists) {
			const types = isArray(propertySetting)
				? propertySetting
				: isObject(propertySetting)
				? (propertySetting as OptionProperty<any>).type
				: (propertySetting as OptionPropertyTypes<any>)

			if (types !== null) {
				if (!isEqualConstructor(propertyValue, types)) {
					const constructors = isArray(types)
						? `[${types.map((x) => x.prototype.constructor.name).join(', ')}]`
						: types.prototype.constructor.name

					throw `option "${propertyKey}" is not "${constructors}" type`
				}
			}
		}

		/**
		 * If setting have custom validator, call this function
		 */
		if (
			hasOwn(propertySetting, 'validator') &&
			isFunction(propertySetting['validator'])
		) {
			if (!propertySetting['validator'].call(null, propertyValue))
				throw `option "${propertyKey}" did not pass the validator. Value: ${propertyValue}`
		}
	}

	return properties as Required<Properties>
}
