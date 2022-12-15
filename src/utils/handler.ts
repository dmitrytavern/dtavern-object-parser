import { metadata } from './metadata'
import { PropertyKey } from '@types'
import { mergeErrors, ParserError } from './errors'

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
	[ERROR_LIST_KEY]: ParserError[]
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
 * @throws if an object is already handled because it is
 * a circular structure.
 * @internal
 */
const handle = (store: HandlerStore, object: object): void => {
	const isHandled = metadata.has(object)
		? metadata.get(object, M_IS_HANDLED)
		: false

	if (isHandled) throw new ParserError(`detected a circular structure`)

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
const error = (store: HandlerStore, error: ParserError): void => {
	const path =
		store[NESTED_LIST_KEY].length === 0
			? 'root'
			: store[NESTED_LIST_KEY].reduce(
					(acc, value) =>
						acc + (typeof value === 'string' ? `.${value}` : `[${value}]`)
			  )

	store[ERROR_LIST_KEY].push(
		new ParserError(
			`in "${path}" error: ${
				error.message.charAt(0).toLowerCase() + error.message.slice(1)
			}`
		)
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
		throw mergeErrors(store[ERROR_LIST_KEY])
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
