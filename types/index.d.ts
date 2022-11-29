/* eslint-disable @typescript-eslint/no-explicit-any */

import { SchemaAsArray, SchemaAsObject, SchemaReturn } from './schema'
import { OptionSettings, OptionTypeSetting } from './option'
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

export function schemaProperty<Type extends OptionTypeSetting<any>>(
	schemaOptionSettings: OptionSettings<Type>
): OptionSettings<Type>

export function parseValue<OptionValue extends OptionTypeSetting<any>>(
	optionValue: OptionValue,
	optionSchema: OptionSettings<OptionValue>,
	existsInParents?: boolean
): OptionValue

export const options: {
	parse: typeof parseOptions
	single: typeof parseValue
	schemaProperty: typeof schemaProperty
	AsyncFunction: typeof AsyncFunction
}

export default options
