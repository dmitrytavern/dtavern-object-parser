import { SchemaProperty as SchemaPropertyType } from '@types'
import { hasOwn } from './utils'

export const settingsFlagName = '__dtavern_option_pareser__is_schema_property'

export const schemaProperty = <Type>(
	schemaPropertySettings: SchemaPropertyType<Type>
): SchemaPropertyType<Type> => {
	if (hasOwn(schemaPropertySettings, settingsFlagName))
		throw 'Object already have settings flag name'

	schemaPropertySettings[settingsFlagName] = true

	return schemaPropertySettings
}

export const isSchemaProperty = (schemaPropertySettings: object): boolean => {
	return (
		hasOwn(schemaPropertySettings, settingsFlagName) &&
		schemaPropertySettings[settingsFlagName]
	)
}
