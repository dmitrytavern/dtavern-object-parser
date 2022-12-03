import { SchemaType, SchemaReturn } from './schema'
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

interface Generator<T = unknown, TReturn = any, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	// NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>
	return(value: TReturn): IteratorResult<T, TReturn>
	throw(e: any): IteratorResult<T, TReturn>
	[Symbol.iterator](): Generator<T, TReturn, TNext>
}

export type ParsePropertyResponse = {
	isChanged: boolean
	value: any
	errors: string[]
}

export type AsyncFunctionType = (...args: any[]) => Promise<boolean>
export type GeneratorFunctionType = <
	T = unknown,
	TReturn = any,
	TNext = unknown
>(
	...args: any
) => Generator<T, TReturn, TNext>
export const AsyncFunction: AsyncFunctionType
export const GeneratorFunction: GeneratorFunctionType

export declare function isSchema(object: object): boolean

export declare function isSchemaProperty(object: object): boolean

export declare function createSchema<Schema>(schema: Schema): SchemaType<Schema>

export declare function createSchemaProperty<
	Type extends OptionTypeSetting<any>,
	Default extends OptionDefaultSetting<Type>,
	Required extends OptionRequiredSetting,
	Validator extends OptionValidatorSetting<Type>
>(
	settings: RawOptionSettings<Type, Default, Required, Validator>
): OptionSettings<Type, Default, Required, Validator>

export declare function parseProperties<
	OptionsSchema,
	Return = SchemaReturn<OptionsSchema>
>(options: any, schema: OptionsSchema, config?: Config): Return

export declare function parseProperty<Type extends OptionTypeSetting<any>>(
	options: object | undefined,
	optionKey: string,
	optionSchema: RawOptionSettings<Type, any, any, any>
): ParsePropertyResponse

declare function hasOwn(obj: any | Array<any>, key: string): boolean
declare function isObject(obj: any): boolean
declare function isFunction(value: any): value is (...args: any[]) => boolean
declare function compareConstructors(
	propertyValue: any,
	types: OptionTypeSetting<any>
): boolean

export declare const utils: {
	AsyncFunction: typeof AsyncFunction
	GeneratorFunction: typeof GeneratorFunction
	compareConstructors: typeof compareConstructors
	hasOwn: typeof hasOwn
	isArray: typeof Array.isArray
	isObject: typeof isObject
	isFunction: typeof isFunction
}

export declare const parser: {
	parse: typeof parseProperties
	single: typeof parseProperty
	schema: typeof createSchema
	property: typeof createSchemaProperty
	isSchema: typeof isSchema
	isProperty: typeof isSchemaProperty
	utils: typeof utils
}

export default parser
