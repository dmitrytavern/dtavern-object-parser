import { RawSchema, Schema } from './schema'

/**
 * User object type.
 * @public
 */
export type Properties = null | undefined | any[] | object

/**
 * Schema for the user object.
 * @public
 */
export type PropertiesSchema = RawSchema | Schema

/**
 * The readonly object type which uses only for reading original info.
 * @public
 */
export type ReadonlyObject = Properties

/**
 * The writable object type which use to write new info.
 * @public
 */
export type WritableObject = Properties & object

/**
 * Property key type for iterations.
 * @public
 */
export type PropertyKey = string | number
