import { RawSchema, Schema } from './schema'

/**
 * User object type.
 */
export type Properties = null | undefined | any[] | object

/**
 * Schema for the user object.
 */
export type PropertiesSchema = RawSchema | Schema

/**
 * The readonly object type which uses only for reading original info.
 */
export type ReadonlyObject = Properties

/**
 * The writable object type which use to write new info.
 */
export type WritableObject = Properties & object

/**
 * Property key type for iterations.
 */
export type PropertyKey = string | number
