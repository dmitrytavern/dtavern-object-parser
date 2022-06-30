/* eslint-disable @typescript-eslint/no-explicit-any */
export const isArray = Array.isArray

export function isObject(obj: any): boolean {
	return obj !== null && typeof obj === 'object'
}

export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === 'function'
}

export function hasOwn(obj: any | Array<any>, key: string): boolean {
	return Object.prototype.hasOwnProperty.call(obj, key)
}
