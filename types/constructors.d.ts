/**
 * JavaScript constructor type.
 */
export type Constructor<T = any> = ConstructorFunction<T> | ConstructorClass<T>

export type ArrayConstructor = typeof Array

export type AsyncFunctionConstructor = (...args: any[]) => Promise<boolean>

export type GeneratorFunctionConstructor = <
	T = unknown,
	TReturn = any,
	TNext = unknown
>(
	...args: any
) => Generator<T, TReturn, TNext>

export type ConstructorReturn<Constructors> =
	Constructors extends Constructor<any>[]
		? ConstructorReturnTypes<Constructors>
		: ConstructorReturnType<Constructors>

// Helpers

export type HaveArrayConstructor<T> = T extends any[]
	? T extends (infer Type)[]
		? Extract<Type, typeof Array> extends never
			? false
			: true
		: never
	: Extract<T, typeof Array> extends never
	? false
	: true

type ConstructorFunction<T = any> = { (): T }

type ConstructorClass<T = any> = { new (...args: any[]): T }

type ConstructorReturnTypes<Constructors> =
	Constructors extends (infer Constructor)[]
		? ConstructorReturnType<Constructor>
		: never

type ConstructorReturnType<Constructor> =
	Constructor extends ConstructorClass<any>
		? InstanceType<Constructor>
		: Constructor extends (...args: any) => infer R
		? R
		: any

interface Generator<T = unknown, TReturn = any, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>
	return(value: TReturn): IteratorResult<T, TReturn>
	throw(e: any): IteratorResult<T, TReturn>
	[Symbol.iterator](): Generator<T, TReturn, TNext>
}
