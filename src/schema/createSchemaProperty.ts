import { setMetadata, hasMetadata, getMetadata } from '../utils/metadata'
import { isArray } from 'src/utils/objects'
import {
	OptionSettings,
	OptionTypeSetting,
	OptionRequiredSetting,
	OptionValidatorSetting,
	OptionDefaultSetting,
	RawOptionSettings,
} from '@types'

const defaultSettings = {
	type: null,
	required: true,
	default: null,
	validator: null,
}

export const isSchemaProperty = (object: object): boolean =>
	hasMetadata(object) ? getMetadata(object, 'isSettings') : false

export const createSchemaProperty = <
	Type extends OptionTypeSetting<any>,
	Default extends OptionDefaultSetting<Type>,
	Required extends OptionRequiredSetting,
	Validator extends OptionValidatorSetting<Type>
>(
	settings: RawOptionSettings<Type, Default, Required, Validator>
): OptionSettings<Type, Default, Required, Validator> => {
	if (hasMetadata(settings))
		throw 'Object already defined as schema property settings'

	for (const key of Object.keys(settings))
		if (!['type', 'required', 'default', 'validator'].includes(key))
			throw `unknown schema key "${key}"`

	const settingsClone = Object.assign({}, defaultSettings, settings)

	settingsClone.type = isArray(settingsClone.type) ? Object.freeze([...settingsClone.type]) : settingsClone.type

	setMetadata(settingsClone, 'isSchema', false)
	setMetadata(settingsClone, 'isSettings', true)

	return Object.freeze(settingsClone)
}
