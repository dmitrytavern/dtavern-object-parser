export const isArray = Array.isArray

/**
 * Returns `true` if the arg is `null` or `undefined`, otherwise returns `false`.
 *
 * @param arg
 * @internal
 */
export function isUndefined(arg: any): arg is undefined | null {
  return arg === undefined || arg === null
}

/**
 * Returns `true` if the arg is not `null` or `undefined`, otherwise returns `false`.
 *
 * @param arg
 * @internal
 */
export function isDefined<T>(arg: T): arg is NonNullable<T> {
  return arg !== undefined && arg !== null
}

/**
 * Returns `true` if the arg is an object, otherwise returns `false`.
 *
 * Note:
 * - If the arg is `Array`, reutrns true.
 * - If the arg is `null`, returns false.
 *
 * @param arg
 * @internal
 */
export function isObject(arg: any): boolean {
  return arg !== null && typeof arg === 'object'
}

/**
 * Returns `true` if the arg is a function, otherwise returns `false`.
 *
 * @param arg
 * @internal
 */
export function isFunction(arg: any): arg is (...args: any[]) => any {
  return typeof arg === 'function'
}

/**
 * The short version of `Object.prototype.hasOwnProperty`.
 *
 * @param object Any object or an array.
 * @param key Object property name or array element index.
 * @internal
 */
export function hasOwn(
  object: Object | Array<any>,
  key: string | number
): boolean {
  return Object.prototype.hasOwnProperty.call(object, key)
}

/**
 * Transforms the arg to an array if it is not an array.
 *
 * ### Example
 *
 * ```typescript
 * toArray(null) // Returns: [null]
 * toArray([null]) // Returns: [null]
 * ```
 *
 * @param arg
 * @internal
 */
export function toArray<T>(arg: T | T[]): T[] {
  return isArray(arg) ? arg : [arg]
}
