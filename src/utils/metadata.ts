import { isObject } from './shared'

const METADATA_NAME = '__dtavern_object_parser'
export const M_IS_SCHEMA = 'isSchema'
export const M_IS_PROPERTY_SCHEMA = 'isPropertySchema'
export const M_IS_HANDLED_SCHEMA = 'isHandledSchema'
export const M_IS_ARRAY_CONSTRUCTOR = 'containsArrayConstructor'
export const M_IS_PRIMITIVE_CONSTRUCTORS = 'isPrimitiveConstructors'

/**
 * Checks metadata exists in this object.
 *
 * @param object Object to check.
 * @internal
 */
const has = (object: object): object is object => {
	return isObject(object) && isObject(object[METADATA_NAME])
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
	return object[METADATA_NAME][key]
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
		Object.defineProperty(object, METADATA_NAME, {
			value: {},
			enumerable: false,
			writable: false,
			configurable: true,
		})
	}
	object[METADATA_NAME][key] = value
}

/**
 * Deletes metadata object from object.
 *
 * @param object Object to metadata delete.
 * @internal
 */
const clear = (object: object): void => {
	if (has(object)) delete object[METADATA_NAME]
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
