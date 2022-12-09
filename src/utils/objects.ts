/**
 * @public
 */
export const isArray = Array.isArray

/**
 * @public
 */
export const toArray = <T>(value: T | T[]): T[] => {
	return isArray(value) ? value : [value]
}

/**
 * @public
 */
export const isObject = (value: any): boolean => {
	return value !== null && typeof value === 'object'
}

/**
 * @public
 */
export const isFunction = (value: any): boolean => {
	return typeof value === 'function'
}

/**
 * @public
 */
export const hasOwn = (value: any | any[], key: any): boolean => {
	return Object.prototype.hasOwnProperty.call(value, key)
}
