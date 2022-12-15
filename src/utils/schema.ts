import { Schema, PropertySchema } from '@types'
import {
	metadata,
	M_IS_SCHEMA,
	M_IS_PROPERTY_SCHEMA,
	M_IS_HANDLED_SCHEMA,
	M_IS_ARRAY_CONSTRUCTOR,
} from 'src/utils/metadata'

/**
 * Returns `true` if the object is a schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @public
 */
export function isSchema(object: object): object is Schema {
	return metadata.get(object, M_IS_SCHEMA)
}

/**
 * Returns `true` if the object is a property schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @public
 */
export function isPropertySchema(object: object): object is PropertySchema {
	return metadata.get(object, M_IS_PROPERTY_SCHEMA)
}

/**
 * Returns `true` if the object is a some schema, otherwise returns `false`.
 *
 * @param object Target object.
 * @internal
 */
export function isHandledSchema(object: any): boolean {
	return metadata.get(object, M_IS_HANDLED_SCHEMA)
}

/**
 * Returns `true` if the object is a property schema with an array type,
 * otherwise returns `false`.
 *
 * @param object Target object.
 * @internal
 */
export function isArrayTypeSchema(object: any): boolean {
	return metadata.get(object, M_IS_ARRAY_CONSTRUCTOR)
}
