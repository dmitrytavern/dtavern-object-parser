import { toArray } from './objects'
import { metadata } from './metadata'

export type ObjectHandler = {
	set(key: string): void
	unset(): void
	handle(object: object): void
	isHandled(object: object): boolean
	addError(message: string | string[]): void
	validate(): void
	clear(): void
}

/**
 * @internal
 */
export const useObjectHandler = (): ObjectHandler => {
	const errorList: string[] = []
	const nestedList: string[] = []
	const handledList: object[] = []

	const set = (key: string) => nestedList.push(key)

	const unset = () => nestedList.pop()

	const handle = (object: object) => {
		metadata.set(object, 'isHandled', true)
		handledList.push(object)
	}

	const isHandled = (object: object) =>
		metadata.has(object) ? metadata.get(object, 'isHandled') : false

	const getNestedPath = () =>
		nestedList.length === 0 ? 'root' : nestedList.join('.')

	const addError = (message: string | string[]) =>
		toArray(message).forEach((message) =>
			errorList.push(`in "${getNestedPath()}" error: ${message}`)
		)

	const validate = () => {
		if (errorList.length > 0) {
			throw new Error('\n' + errorList.join('\n'))
		}
	}

	const clear = () => {
		handledList.forEach((obj) => metadata.delete(obj))
		errorList.length = 0
		nestedList.length = 0
		handledList.length = 0
	}

	return {
		set,
		unset,
		handle,
		isHandled,
		addError,
		validate,
		clear,
	}
}
