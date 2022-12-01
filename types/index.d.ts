import { Schema, RawSchema, SchemaReturn } from './schema'
import { Config } from './config'
import {
	OptionSettings,
	OptionTypeSetting,
	OptionRequiredSetting,
	OptionDefaultSetting,
	OptionValidatorSetting,
	RawOptionSettings,
} from './option'

export * from './option'
export * from './config'
export * from './schema'

export type AsyncFunctionType = (...args: any[]) => Promise<boolean>

export const AsyncFunction: AsyncFunctionType

export function isSchema(object: object): boolean

export function isSchemaProperty(object: object): boolean

export function createSchema(schema: RawSchema): Schema

export function createSchemaProperty<
	Type extends OptionTypeSetting<any>,
	Default extends OptionDefaultSetting<Type>,
	Required extends OptionRequiredSetting,
	Validator extends OptionValidatorSetting<Type>
>(
	settings: RawOptionSettings<Type, Default, Required, Validator>
): OptionSettings<Type, Default, Required, Validator>

export function parseOptions<
	OptionsSchema,
	Return = SchemaReturn<OptionsSchema>
>(options: any, schema: OptionsSchema, config?: Config): Return

export function parseValue<OptionValue extends OptionTypeSetting<any>>(
	optionValue: OptionValue,
	optionSchema: OptionSettings<OptionValue, any, any, any>,
	existsInParents?: boolean
): OptionValue

export const options: {
	parse: typeof parseOptions
	single: typeof parseValue
	AsyncFunction: typeof AsyncFunction
	createSchema: typeof createSchema
	createSchemaProperty: typeof createSchemaProperty
	isSchema: typeof isSchema
	isSchemaProperty: typeof isSchemaProperty
}

export default options
