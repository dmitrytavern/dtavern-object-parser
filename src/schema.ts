import { hasOwn } from '@utilities'
import {
	OptionSettings,
	OptionTypeSetting,
	OptionRequiredSetting,
} from '@types'

export const settingsFlagName = '__dtavern_option_pareser__is_schema_property'

export const schemaProperty = <
	T extends OptionTypeSetting<any>,
	R extends OptionRequiredSetting
>(
	settings: OptionSettings<T, R>
): OptionSettings<T, R> => {
	if (hasOwn(settings, settingsFlagName))
		throw 'Object already have settings flag name'

	for (const key of Object.keys(settings))
		if (
			!['type', 'required', 'default', 'validator', settingsFlagName].includes(
				key
			)
		)
			throw `unknown schema key "${key}"`

	settings[settingsFlagName] = true

	return settings
}

export const isSchemaProperty = (object: object): boolean => {
	return hasOwn(object, settingsFlagName) && object[settingsFlagName]
}
