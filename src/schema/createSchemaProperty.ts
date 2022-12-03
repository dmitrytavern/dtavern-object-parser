import { setMetadata, hasMetadata, getMetadata } from '../utils/metadata'
import { isArray, isObject, isFunction, hasOwn } from 'src/utils/objects'
import { validateConstructors } from '../utils/constructor'
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
	if (!isObject(settings)) {
		throw 'settings is not object'
	}

	if (hasMetadata(settings)) {
		throw 'object already defined as schema property settings'
	}

	for (const key of Object.keys(settings))
		if (!['type', 'required', 'default', 'validator'].includes(key))
			throw `unknown setting key "${key}"`

	if (hasOwn(settings, 'type') && settings.type !== null) {
		const errors = validateConstructors(settings.type)

		if (errors.length > 0) {
			const s = errors.join(', ')
			throw `type setting have no function type. No-function: ${s}`
		}
	}

	if (hasOwn(settings, 'validator'))
		if (!isFunction(settings.validator))
			throw `validator setting is not function`

	const settingsClone = Object.assign({}, defaultSettings, settings)

	settingsClone.type = isArray(settingsClone.type)
		? Object.freeze([...settingsClone.type])
		: settingsClone.type

	setMetadata(settingsClone, 'isSchema', false)
	setMetadata(settingsClone, 'isSettings', true)

	return Object.freeze(settingsClone)
}
