import { PropertyType, AsyncFunctionType, GeneratorFunctionType } from '@types'
import { isArray, isFunction } from './objects'

export const AsyncFunction: AsyncFunctionType = new Function(
	`return async () => {}`
)().constructor

export const GeneratorFunction: GeneratorFunctionType = new Function(
	`return function* t() {}`
)().constructor

export const compareConstructors = (
	instance: any,
	constructors: PropertyType
): boolean => {
	const _types = getInstanceConstructors(instance)
	const _classes = isArray(constructors) ? constructors : [constructors]

	for (const _class of _classes) {
		if (_types.includes(_class)) {
			return true
		}
	}

	return false
}

export const validateConstructors = (type): any[] => {
	const _types = isArray(type) ? type : [type]
	const errors = []

	for (const _type of _types) {
		if (!isFunction(_type)) {
			errors.push(_type)
		}
	}

	return errors
}

const getInstanceConstructors = (instance) => {
	if (instance === null || instance === undefined) return [instance]

	let next = Object.getPrototypeOf(instance)

	if (next) {
		const constructors = []
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
