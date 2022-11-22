import { SchemaOptionSettings } from '@types'
import { hasOwn } from './utils'

export const settingsFlagName = '__dtavern_option_pareser__is_schema_property'

export const schemaProperty = <Type>(
	schemaPropertySettings: SchemaOptionSettings<Type>
): SchemaOptionSettings<Type> => {
	if (hasOwn(schemaPropertySettings, settingsFlagName))
		throw 'Object already have settings flag name'

	for (const key of Object.keys(schemaPropertySettings))
		if (
			!['type', 'required', 'default', 'validator', settingsFlagName].includes(
				key
			)
		)
			throw `unknown Schema key "${key}"`

	schemaPropertySettings[settingsFlagName] = true

	return schemaPropertySettings
}

export const isSchemaProperty = (schemaPropertySettings: object): boolean => {
	return (
		hasOwn(schemaPropertySettings, settingsFlagName) &&
		schemaPropertySettings[settingsFlagName]
	)
}
