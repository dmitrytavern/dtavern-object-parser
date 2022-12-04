export type AsyncFunctionType = (...args: any[]) => Promise<boolean>
export type GeneratorFunctionType = <
	T = unknown,
	TReturn = any,
	TNext = unknown
>(
	...args: any
) => Generator<T, TReturn, TNext>

interface Generator<T = unknown, TReturn = any, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	// NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>
	return(value: TReturn): IteratorResult<T, TReturn>
	throw(e: any): IteratorResult<T, TReturn>
	[Symbol.iterator](): Generator<T, TReturn, TNext>
}
