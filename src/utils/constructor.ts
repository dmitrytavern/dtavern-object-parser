import {
	OptionTypeSetting,
	AsyncFunctionType,
	GeneratorFunctionType,
} from '@types'
import { isArray, isObject } from './objects'

type Constructors = OptionTypeSetting<any> | undefined

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AsyncFunction: AsyncFunctionType = new Function(
	`return async () => {}`
)().constructor

export const GeneratorFunction: GeneratorFunctionType = new Function(
	`return function* t() {}`
)().constructor

export const compareConstructors = (
	propertyValue: any,
	constructors: Constructors
): boolean => {
	if (propertyValue === null || propertyValue === undefined)
		return propertyValue === constructors

	if (constructors === null || constructors === undefined)
		return propertyValue === constructors

	const _classes = isArray(constructors) ? constructors : [constructors]

	for (const _class of _classes) {
		if (propertyValue.constructor === _class) {
			return true
		}

		// Handle Object.create(null)
		if (
			!propertyValue.constructor &&
			_class === Object &&
			!isArray(propertyValue) &&
			isObject(propertyValue)
		) {
			return true
		}
	}

	return false
}
