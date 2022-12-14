import { toArray, isFunction } from './objects'
import {
	Constructor,
	AsyncFunctionConstructor,
	GeneratorFunctionConstructor,
} from '@types'

type ConstructorType = Constructor | Constructor[]
type ConstructorArgType = null | undefined | Constructor | Constructor[]

/**
 * Compares two arrays of constructors and returns `true` when found
 * some match, otherwise returns `false`.
 *
 * Note:
 * - If you pass the constructor (not array) it will be transformed
 * into an array.
 * - If you pass the no-function type to the array (first or second)
 * it will be ignored.
 * - If some array will be empty returns `false`.
 *
 * ### Example
 *
 * ```typescript
 * compareConstructors(String, String)     // Returns: true
 * compareConstructors([String], [String]) // Returns: true
 * compareConstructors([String], [Number]) // Returns: false
 * compareConstructors([], [])             // Returns: false
 * ```
 *
 * @param arg1 First an array of constructors.
 * @param arg2 Second an array of constructors.
 * @public
 */
export function compareConstructors(
	arg1: ConstructorType,
	arg2: ConstructorType
): boolean {
	const _constructors1 = toArray(arg1)
	const _constructors2 = toArray(arg2)

	for (const _class of _constructors1)
		if (isFunction(_class) && _constructors2.includes(_class)) {
			return true
		}
	return false
}

/**
 * Returns an array of constructors by the object prototype hierarchy.
 *
 * Note:
 * - If the instance is null or undefined, returns an empty array.
 * - If you pass a plain object which is created by `Object.create(null)`,
 * returns an array with the `Object` constructor.
 * - In JavaScript everthing is an object.
 *
 * ### Example
 *
 * ```typescript
 * getConstructors(null)      // Returns: []
 * getConstructors(true)      // Returns: [Boolean, Object]
 * getConstructors({})        // Returns: [Object]
 * getConstructors([])        // Returns: [Array, Object]
 * getConstructors(() => {})  // Returns: [Function, Object]
 * ```
 *
 * @param instance Instance of some contructor.
 * @public
 */
export function getConstructors(instance: any): Constructor[] {
	if (instance === null || instance === undefined) return []

	let next = Object.getPrototypeOf(instance)

	if (next) {
		const constructors: Constructor[] = []
		constructors.push(next.constructor)

		while (next) {
			if (!constructors.includes(next.constructor))
				constructors.push(next.constructor)
			next = Object.getPrototypeOf(next)
		}

		return constructors
	} else {
		// Handle Object.create(null)
		return [Object]
	}
}

/**
 * Returns `true` if the argument is a constructor or the array of constructors,
 * otherwise returns `false`.
 *
 * Note:
 * - If you pass an empty array, returns `false`. It is more correct and prevents
 * the case when this function returns `true` when the value for a check is
 * an empty array.
 *
 * ### Example
 *
 * ```typescript
 * isConstructors(String)         // Retunrs: true
 * isConstructors('Hello')        // Retunrs: true
 * isConstructors([])             // Retunrs: false
 * isConstructors([[]])           // Retunrs: false
 * isConstructors([String, null]) // Retunrs: false
 * ```
 *
 * @param arg
 * @public
 */
export function isConstructors(arg: any): arg is ConstructorType {
	const arr = toArray(arg)

	if (arr.length === 0) return false

	for (const constructor of toArray(arg)) {
		if (!isFunction(constructor)) {
			return false
		}
	}
	return true
}

/**
 * Returns `true` if the argument is a primitive constructor or the array of
 * primitive constructors, otherwise returns `false`.
 *
 * Primitive constructors: `String`, `Number`, `Boolean`, `BigInt`, `Symbol`.
 *
 * Note:
 * - If you pass `null` or `undefined` type, returns false. These types are not
 * a constructor.
 * - If you pass an empty array, returns `false`.
 *
 * ### Example
 *
 * ```typescript
 * isPrimitiveConstructors(String)           // Retunrs: true
 * isPrimitiveConstructors(Object)           // Retunrs: false
 * isPrimitiveConstructors([String, Object]) // Retunrs: false
 * ```
 *
 * @param arg Constructor or array of constructors.
 * @public
 */
export function isPrimitiveConstructors(arg: ConstructorArgType): boolean {
	const arr = toArray(arg)

	if (arr.length === 0) return false

	for (const constructor of arr)
		if (![String, Number, Boolean, BigInt, Symbol].includes(constructor as any))
			return false
	return true
}

/**
 * TODO: Rewrite it.
 * Returns the async function constructor.
 *
 * @public
 */
export const AsyncFunction: AsyncFunctionConstructor = new Function(
	`return async () => {}`
)().constructor

/**
 * TODO: Rewrite it.
 * Returns the generator function constructor.
 *
 * @public
 */
export const GeneratorFunction: GeneratorFunctionConstructor = new Function(
	`return function* t() {}`
)().constructor
