import { toArray } from './shared'
import { metadata } from './metadata'

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
	[ERROR_LIST_KEY]: string[]
	[NESTED_LIST_KEY]: string[]
	[HANDLED_LIST_KEY]: object[]
}

/**
 * Adds a nested object level.
 *
 * @param store The handler store.
 * @param key The nested level name.
 * @internal
 */
const set = (store: HandlerStore, key: string): void => {
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
 * @throws if an object is already handled because it is
 * a circular structure.
 * @internal
 */
const handle = (store: HandlerStore, object: object): void => {
	const isHandled = metadata.has(object)
		? metadata.get(object, M_IS_HANDLED)
		: false

	if (isHandled) throw `detected a circular structure`

	metadata.set(object, M_IS_HANDLED, true)

	store[HANDLED_LIST_KEY].push(object)
}

/**
 * Adds an error to the store.
 *
 * @param store The handler store.
 * @param message An error message.
 * @internal
 */
const error = (store: HandlerStore, message: string | string[]): void => {
	const path =
		store[NESTED_LIST_KEY].length === 0
			? 'root'
			: store[NESTED_LIST_KEY].join('.')

	toArray(message).forEach((message) =>
		store[ERROR_LIST_KEY].push(`in "${path}" error: ${message}`)
	)
}

/**
 * Validate the store.
 *
 * @param store The handler store to validate.
 * @throws if the store has errors.
 * @internal
 */
const validate = (store: HandlerStore): void => {
	if (store[ERROR_LIST_KEY].length > 0) {
		throw new Error('\n' + store[ERROR_LIST_KEY].join('\n'))
	}
}

/**
 * Clears object temp properties and clears the store.
 *
 * @param store The handler store.
 * @internal
 */
const clear = (store: HandlerStore): void => {
	store[HANDLED_LIST_KEY].forEach((obj) => metadata.clear(obj))
	store[ERROR_LIST_KEY].length = 0
	store[NESTED_LIST_KEY].length = 0
	store[HANDLED_LIST_KEY].length = 0
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
	error,
	validate,
	clear,
}
