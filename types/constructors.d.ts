/**
 * JavaScript constructor type.
 * @public
 */
export type Constructor<T = any> = ConstructorFunction<T> | ConstructorClass<T>

/**
 * Array constructor type.
 * @public
 */
export type ArrayConstructor = typeof Array

/**
 * Async function constructor type.
 * @public
 */
export type AsyncFunctionConstructor = (...args: any[]) => Promise<boolean>

/**
 * Generator function constructor type.
 * @public
 */
export type GeneratorFunctionConstructor = <
	T = unknown,
	TReturn = any,
	TNext = unknown
>(
	...args: any
) => Generator<T, TReturn, TNext>

/**
 * Constructor return type.
 * @public
 */
export type ConstructorReturn<Constructors> =
	Constructors extends Constructor<any>[]
		? ConstructorReturnTypes<Constructors>
		: ConstructorReturnType<Constructors>

/**
 * Checks exists array constructor type in T.
 * @public
 */
export type HaveArrayConstructor<T> = T extends any[]
	? T extends (infer Type)[]
		? Extract<Type, typeof Array> extends never
			? false
			: true
		: never
	: Extract<T, typeof Array> extends never
	? false
	: true

/**
 * Function constructor type.
 * @public
 */
type ConstructorFunction<T = any> = { (): T }

/**
 * Class constructor type.
 * @public
 */
type ConstructorClass<T = any> = { new (...args: any[]): T }

/**
 * Returns the constructor type form an array of constructors.
 * @public
 */
type ConstructorReturnTypes<Constructors> =
	Constructors extends (infer Constructor)[]
		? ConstructorReturnType<Constructor>
		: never

/**
 * Returns the constructor type.
 * @public
 */
type ConstructorReturnType<Constructor> =
	Constructor extends ConstructorFunction
		? ReturnType<Constructor>
		: Constructor extends ConstructorClass
		? InstanceType<Constructor>
		: any

/**
 * Generator function returns type.
 * @public
 */
interface Generator<T = unknown, TReturn = any, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>
	return(value: TReturn): IteratorResult<T, TReturn>
	throw(e: any): IteratorResult<T, TReturn>
	[Symbol.iterator](): Generator<T, TReturn, TNext>
}
