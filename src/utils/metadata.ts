import { isObject } from './shared'

const metadataName = '__dtavern_object_parser'

/**
 * Checks metadata exists in this object.
 *
 * @param object Object to check.
 * @internal
 */
const has = (object: object): object is object => {
	return isObject(object) && isObject(object[metadataName])
}

/**
 * Returns metadata property value from the object.
 *
 * Note: if the object has no metadata, it returns `undefined`.
 *
 * @param object Object with metadata.
 * @param key Metadata property name.
 * @internal
 */
const get = (object: object, key: string): any => {
	if (!has(object)) return undefined
	return object[metadataName][key]
}

/**
 * Sets metadata property value to object by key.
 *
 * @param object Object to set.
 * @param key Metadata property name.
 * @param value Metadata property value.
 * @internal
 */
const set = (object: object, key: string, value: any): void => {
	if (!has(object)) {
		Object.defineProperty(object, metadataName, {
			value: {},
			enumerable: false,
			writable: false,
			configurable: true,
		})
	}
	object[metadataName][key] = value
}

/**
 * Deletes metadata object from object.
 *
 * @param object Object to metadata delete.
 * @internal
 */
const clear = (object: object): void => {
	if (has(object)) delete object[metadataName]
}

/**
 * Util functions for works with object metadata.
 *
 * @internal
 */
export const metadata = {
	has,
	get,
	set,
	clear,
}
