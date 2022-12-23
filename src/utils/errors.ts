import { Constructor, PropertySchema } from '@types'

export enum Errors {
	ObjectError = 'ObjectError',
	PropertyError = 'PropertyError',
}

interface Error {
	name: keyof typeof Errors
}

/**
 * Property error during the object property parsing.
 */
export interface PropertyError extends Error {
	name: Errors.PropertyError
	message: string
	exists: boolean
	value: any
	valueIsDefault: boolean
	valueConstructors: Constructor[]
	schema: PropertySchema
}

/**
 * Schema error during the schema creating.
 */
export interface ObjectError extends Error {
	name: Errors.ObjectError
	message: string
}

/**
 * Property error wrapper for the parser.
 */
export interface GeneralError {
	key: PropertyKey
	error: PropertyError | ObjectError
}

/**
 * Creates object error.
 * @internal
 */
export const createObjectError = (
	message: ObjectError['message']
): ObjectError => ({
	name: Errors.ObjectError,
	message,
})

/**
 * Creates property error.
 * @internal
 */
export const createPropertyError = (
	message: PropertyError['message'],
	exists: PropertyError['exists'],
	value: PropertyError['value'],
	valueIsDefault: PropertyError['valueIsDefault'],
	valueConstructors: PropertyError['valueConstructors'],
	schema: PropertyError['schema']
): PropertyError => ({
	name: Errors.PropertyError,
	message,
	exists,
	value,
	valueIsDefault,
	valueConstructors,
	schema,
})
