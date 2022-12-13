import { Schema, PropertySchema } from '@types'
import { metadata } from 'src/utils/metadata'

/**
 * Returns `true` if the object is a schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @public
 */
export function isSchema(object: object): object is Schema {
	return metadata.get(object, 'isSchema')
}

/**
 * Returns `true` if the object is a property schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @public
 */
export function isPropertySchema(object: object): object is PropertySchema {
	return metadata.get(object, 'isPropertySchema')
}

/**
 * Returns `true` if the object is a some schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @internal
 */
export function isHandledSchema(object: any): boolean {
	return metadata.get(object, 'isHandledSchema')
}

/**
 * Returns `true` if the object is a property schema with an array type,
 * otherwise returns `false`.
 *
 * @param object Target object.
 * @internal
 */
export function isArrayTypeSchema(object: any): boolean {
	return metadata.get(object, 'isArrayType')
}
