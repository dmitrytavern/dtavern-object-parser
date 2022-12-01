/**
 * Settings for property of schema
 */
export type OptionSettings<
	Type extends OptionTypeSetting<any>,
	Default extends OptionDefaultSetting<Type>,
	Required extends OptionRequiredSetting,
	Validator extends OptionValidatorSetting<Type>
> = {
	type: Type
	default: Default
	required: Required
	validator: Validator
}

export type RawOptionSettings<
	Type extends OptionTypeSetting<any>,
	Default extends OptionDefaultSetting<Type>,
	Required extends OptionRequiredSetting,
	Validator extends OptionValidatorSetting<Type>
> = Partial<OptionSettings<Type, Default, Required, Validator>>

export type OptionTypeSetting<T> =
	| null
	| OptionConstructor<T>
	| OptionConstructor<T>[]

export type OptionDefaultSetting<T> =
	| null
	| OptionConstructorReturn<T>
	| (() => OptionConstructorReturn<T>)

export type OptionRequiredSetting = boolean

export type OptionValidatorSetting<T> =
	| null
	| ((value: OptionConstructorReturn<T>) => boolean)

/**
 * Helpers for property
 */

export type OptionConstructor<T> =
	| OptionConstructorFunction<T>
	| OptionConstructorClass<T>

type OptionConstructorFunction<T> = { (): T }
type OptionConstructorClass<T> = { new (...args: any[]): T }

export type OptionConstructorReturn<Constructor> =
	Constructor extends OptionConstructor<any>[]
		? ConstructorReturnTypes<Constructor>
		: ConstructorReturnType<Constructor>

type ConstructorReturnTypes<Constructors> =
	Constructors extends (infer Constructor)[]
		? ConstructorReturnType<Constructor>
		: never

type ConstructorReturnType<Constructor> =
	Constructor extends OptionConstructorClass<any>
		? InstanceType<Constructor>
		: Constructor extends (...args: any) => infer R
		? R
		: any
