import { isArray } from './objects'
import {
	OptionTypeSetting,
	AsyncFunctionType,
	GeneratorFunctionType,
} from '@types'

type Constructors = OptionTypeSetting<any> | undefined

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AsyncFunction: AsyncFunctionType = new Function(
	`return async () => {}`
)().constructor

export const GeneratorFunction: GeneratorFunctionType = new Function(
	`return function* t() {}`
)().constructor

export const compareConstructors = (
	instance: any,
	constructors: Constructors
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
