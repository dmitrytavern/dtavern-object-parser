/**
 * Settings for property of schema
 */
export type OptionSettings<
	T extends OptionTypeSetting<any>,
	K extends OptionRequiredSetting
> = {
	type?: T
	default?: OptionDefaultSetting<T>
	required?: K
	validator?: OptionValidatorSetting<T>
}

export type OptionTypeSetting<T> =
	| null
	| OptionConstructor<T>
	| OptionConstructor<T>[]

export type OptionDefaultSetting<T> =
	| null
	| undefined
	| OptionConstructorReturn<T>
	| (() => OptionConstructorReturn<T>)

export type OptionRequiredSetting = boolean

export type OptionValidatorSetting<T> = {
	(value: OptionConstructorReturn<T>): boolean
}

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
