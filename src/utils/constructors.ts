import { toArray, isFunction } from './objects'
import {
	Constructor,
	ConstructorType,
	AsyncFunctionType,
	GeneratorFunctionType,
} from '@types'

/**
 * @public
 */
export const AsyncFunction: AsyncFunctionType = new Function(
	`return async () => {}`
)().constructor

/**
 * @public
 */
export const GeneratorFunction: GeneratorFunctionType = new Function(
	`return function* t() {}`
)().constructor

/**
 * @public
 */
export const compareConstructors = (
	constructors1: ConstructorType,
	constructors2: ConstructorType
): boolean => {
	const _constructors1 = toArray(constructors1)
	const _constructors2 = toArray(constructors2)

	for (const _class of _constructors1)
		if (isFunction(_class) && _constructors2.includes(_class)) {
			return true
		}
	return false
}

/**
 * @public
 */
export const getConstructors = (instance: any): Constructor[] => {
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
 * @public
 */
export const isConstructors = (value: any): boolean => {
	for (const constructor of toArray(value)) {
		if (!isFunction(constructor)) {
			return false
		}
	}
	return true
}
