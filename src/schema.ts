/* eslint-disable @typescript-eslint/no-explicit-any */

import { OptionSettings, OptionTypeSetting } from '@types'
import { hasOwn } from './utils'

export const settingsFlagName = '__dtavern_option_pareser__is_schema_property'

export const schemaProperty = <Type extends OptionTypeSetting<any>>(
	propertySettings: OptionSettings<Type>
): OptionSettings<Type> => {
	if (hasOwn(propertySettings, settingsFlagName))
		throw 'Object already have settings flag name'

	for (const key of Object.keys(propertySettings))
		if (
			!['type', 'required', 'default', 'validator', settingsFlagName].includes(
				key
			)
		)
			throw `unknown Schema key "${key}"`

	propertySettings[settingsFlagName] = true

	return propertySettings
}

export const isSchemaProperty = (propertySettings: object): boolean => {
	return (
		hasOwn(propertySettings, settingsFlagName) &&
		propertySettings[settingsFlagName]
	)
}
