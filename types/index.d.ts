import { AsyncFunctionType, GeneratorFunctionType } from './functions'
import { Schema, RawSchema, SchemaReturn } from './schema'
import { Config } from './config'
import {
	PropertyOptions,
	PropertyOptionsRaw,
	PropertyType,
	PropertyTypeArray,
	PropertyDefault,
	PropertyRequired,
	PropertyValidator,
} from './options'
import { Constructor, ConstructorType } from './constructor'

export * from './constructor'
export * from './functions'
export * from './options'
export * from './schema'
export * from './config'

export type ParsePropertyResponse = {
	isChanged: boolean
	value: any
}

export const AsyncFunction: AsyncFunctionType

export const GeneratorFunction: GeneratorFunctionType

export declare function isSchema(obj: any): boolean

export declare function isPropertySchema(obj: any): boolean

export declare function createSchema<RawSchemaObject extends RawSchema>(
	schema: RawSchemaObject
): Schema<RawSchemaObject>

export declare function createPropertySchema<
	Type extends PropertyType,
	TypeArray extends PropertyTypeArray,
	Required extends PropertyRequired,
	Default extends PropertyDefault<Type, TypeArray>,
	Validator extends PropertyValidator<Type, TypeArray>
>(
	settings: PropertyOptionsRaw<Type, TypeArray, Required, Default, Validator>
): PropertyOptions<Type, TypeArray, Required, Default, Validator>

export declare function parseProperties<
	OptionsSchema,
	Return = SchemaReturn<OptionsSchema>
>(options: any, schema: OptionsSchema, config?: Config): Return

export declare function parseProperty<Type extends PropertyType>(
	options: object | undefined,
	optionKey: string | number,
	optionSchema: PropertyOptionsRaw<Type, any, any, any, any>
): ParsePropertyResponse

declare function hasOwn(obj: any | Array<any>, key: string | number): boolean
declare function isObject(obj: any): boolean
declare function isFunction(value: any): value is (...args: any[]) => boolean
declare function isConstructors(instance: any): boolean
declare function getConstructors(instance: any): Constructor[]
declare function compareConstructors(
	constructors1: ConstructorType,
	constructors2: ConstructorType
): boolean

export declare const utils: {
	AsyncFunction: typeof AsyncFunction
	GeneratorFunction: typeof GeneratorFunction
	compareConstructors: typeof compareConstructors
	getConstructors: typeof getConstructors
	isConstructors: typeof isConstructors
	hasOwn: typeof hasOwn
	isArray: typeof Array.isArray
	isObject: typeof isObject
	isFunction: typeof isFunction
}

export declare const parser: {
	parse: typeof parseProperties
	single: typeof parseProperty
	schema: typeof createSchema
	property: typeof createPropertySchema
	isSchema: typeof isSchema
	isProperty: typeof isPropertySchema
	utils: typeof utils
}

export default parser
