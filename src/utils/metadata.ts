import { isObject } from './objects'

const metadataName = '__dtavern_object_parser'

/**
 * Checks metadata exists in this object.
 *
 * @param object Object to check.
 * @internal
 */
function hasMetadata(object: object): object is object {
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
function getMetadata(object: object, key: string): any {
	if (!hasMetadata(object)) return undefined
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
function setMetadata(object: object, key: string, value: any): void {
	if (!hasMetadata(object)) {
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
function deleteMetadata(object: object): void {
	if (hasMetadata(object)) delete object[metadataName]
}

/**
 * Util functions for works with object metadata.
 *
 * @internal
 */
export const metadata = {
	has: hasMetadata,
	get: getMetadata,
	set: setMetadata,
	delete: deleteMetadata,
}
