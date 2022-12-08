export const isArray = Array.isArray

export const toArray = <T>(value: T | T[]): T[] => {
	return isArray(value) ? value : [value]
}

export const isObject = (value: any): boolean => {
	return value !== null && typeof value === 'object'
}

export const isFunction = (value: any): boolean => {
	return typeof value === 'function'
}

export const hasOwn = (value: any | any[], key: any): boolean => {
	return Object.prototype.hasOwnProperty.call(value, key)
}
