import { metadata } from './metadata'
import { GeneralError } from './errors'
import { PropertyKey } from '@types'

const ERROR_LIST_KEY = 'e'
const NESTED_LIST_KEY = 'n'
const HANDLED_LIST_KEY = 'h'
const M_IS_HANDLED = 'isHandled'

/**
 * Type of the handler store.
 *
 * @internal
 */
export interface HandlerStore {
	[ERROR_LIST_KEY]: GeneralError[]
	[NESTED_LIST_KEY]: PropertyKey[]
	[HANDLED_LIST_KEY]: object[]
}

/**
 * Adds a nested object level.
 *
 * @param store The handler store.
 * @param key The nested level name.
 * @internal
 */
const set = (store: HandlerStore, key: PropertyKey): void => {
	store[NESTED_LIST_KEY].push(key)
}

/**
 * Removes the last nested object level.
 *
 * @param store The handler store.
 * @internal
 */
const unset = (store: HandlerStore): void => {
	store[NESTED_LIST_KEY].pop()
}

/**
 * Handle an object.
 *
 * @param store The handler store.
 * @param object An object to handle.
 * @internal
 */
const handle = (store: HandlerStore, object: object): void => {
	metadata.set(object, M_IS_HANDLED, true)
	store[HANDLED_LIST_KEY].push(object)
}

/**
 * Returns `true` if object handled, otherwise returns `false`.
 * @interanl
 */
const isHandled = (object: object): boolean => {
	return metadata.has(object) ? metadata.get(object, M_IS_HANDLED) : false
}

/**
 * Adds an error to the store.
 *
 * @param store The handler store.
 * @param message An error message.
 * @internal
 */
const error = (store: HandlerStore, error: GeneralError['error']): void => {
	const key =
		store[NESTED_LIST_KEY].length === 0
			? 'root'
			: store[NESTED_LIST_KEY].reduce(
					(acc, value) =>
						acc + (typeof value === 'string' ? `.${value}` : `[${value}]`)
			  )

	store[ERROR_LIST_KEY].push({ key, error })
}

/**
 * Validate the store.
 *
 * @param store The handler store to validate.
 * @internal
 */
const validate = (store: HandlerStore): GeneralError[] => {
	return store[ERROR_LIST_KEY]
}

/**
 * Clears object temp properties.
 *
 * @param store The handler store.
 * @internal
 */
const clear = (store: HandlerStore): void => {
	store[HANDLED_LIST_KEY].forEach((obj) => metadata.clear(obj))
}

/**
 * Returns the handler store for handler util functions.
 *
 * @internal
 */
export function useHandlerStore() {
	return {
		[ERROR_LIST_KEY]: [],
		[NESTED_LIST_KEY]: [],
		[HANDLED_LIST_KEY]: [],
	}
}

/**
 * Util functions for works with nested objects.
 *
 * @internal
 */
export const handler = {
	set,
	unset,
	handle,
	isHandled,
	error,
	validate,
	clear,
}
