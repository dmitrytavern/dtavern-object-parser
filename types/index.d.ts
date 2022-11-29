/* eslint-disable @typescript-eslint/no-explicit-any */

import { SchemaAsArray, SchemaAsObject, SchemaReturn } from './schema'
import {
	OptionRequiredSetting,
	OptionSettings,
	OptionTypeSetting,
} from './option'
import { Config } from './config'

export * from './option'
export * from './config'
export * from './schema'

export type AsyncFunctionType = (...args: any[]) => Promise<boolean>

export const AsyncFunction: AsyncFunctionType

export function parseOptions<Options, Return = Required<Options>>(
	options: Options,
	schema: SchemaAsArray,
	config?: Config
): Return

export function parseOptions<
	Schema extends SchemaAsObject,
	Return = SchemaReturn<Schema>
>(options: object, schema: Schema, config?: Config): Return

export function schemaProperty<
	Type extends OptionTypeSetting<any>,
	Required extends OptionRequiredSetting
>(
	schemaOptionSettings: OptionSettings<Type, Required>
): OptionSettings<Type, Required>

export function parseValue<OptionValue extends OptionTypeSetting<any>>(
	optionValue: OptionValue,
	optionSchema: OptionSettings<OptionValue, any>,
	existsInParents?: boolean
): OptionValue

export const options: {
	parse: typeof parseOptions
	single: typeof parseValue
	schemaProperty: typeof schemaProperty
	AsyncFunction: typeof AsyncFunction
}

export default options
