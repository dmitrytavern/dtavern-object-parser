import {
	Constructor,
	ConstructorReturn,
	ArrayConstructorType,
} from './constructor'

import { Schema } from './schema'

export type PropertyOptions<
	Type extends PropertyType = any,
	TypeArray extends PropertyTypeArray = any,
	Required extends PropertyRequired = any,
	Default extends PropertyDefault<Type, TypeArray> = any,
	Validator extends PropertyValidator<Type, TypeArray> = any
> = {
	type: Type
	typeElement: Type extends ArrayConstructorType ? TypeArray : never
	default: Default
	required: Required
	validator: Validator
}

export type PropertyOptionsRaw<
	Type extends PropertyType = any,
	TypeArray extends PropertyTypeArray = any,
	Required extends PropertyRequired = any,
	Default extends PropertyDefault<Type, TypeArray> = any,
	Validator extends PropertyValidator<Type, TypeArray> = any
> = {
	type?: Type | Constructor<Type> | null | undefined
	typeElement?: Type extends ArrayConstructorType ? TypeArray : never
	default?: Default
	required?: Required
	validator?: Validator
}

export type PropertyType<Type = any> = Constructor<Type>[]

export type PropertyRequired = null | undefined | boolean

export type PropertyTypeArray = PropertyType | PropertyOptions | Schema<any>

export type PropertyDefault<Type = any, TypeArray = any> =
	| null
	| PropertyContructorReturn<Type, TypeArray>
	| (() => PropertyContructorReturn<Type, TypeArray>)

export type PropertyValidator<Type = any, TypeArray = any> =
	| null
	| ((value: PropertyContructorReturn<Type, TypeArray>) => boolean)

// Options helpers

type PropertyContructorReturn<
	Type = any,
	TypeArray = any
> = TypeArray extends PropertyOptions
	? Extract<Type, ArrayConstructorType> extends never
		? ConstructorReturn<Type>
		: PropertyContructorReturnAsArray<TypeArray>[]
	: PropertyContructorReturnAsSchema<TypeArray>[]

type PropertyContructorReturnAsArray<TypeArray = any> =
	TypeArray extends PropertyOptions
		? TypeArray['required'] extends true
			? ReturnAsArray<TypeArray>
			: ReturnAsArray<TypeArray> | undefined
		: ConstructorReturn<TypeArray>

type PropertyContructorReturnAsSchema<Schema = any> = {
	[Key in keyof Schema]: Schema[Key] extends PropertyOptions
		? PropertyContructorReturn<Schema[Key]['type']>
		: PropertyContructorReturnAsSchema<Schema[Key]>
}

type ReturnAsArray<T extends PropertyOptions = any> = PropertyContructorReturn<
	T['type'],
	T['typeElement']
>
