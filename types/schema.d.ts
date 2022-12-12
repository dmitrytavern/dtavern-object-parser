/**
 * @description
 * This declaration file provides types for describing
 * the object schema.
 *
 * Generic names conventions:
 * 	`S`    - Schema
 * 	`SRaw` - Raw schema
 *  `P` 	 - Schema property
 */

import {
	PropertySchema,
	PropertyTypeRaw,
	PropertyTypeNormalize,
	PropertySchemaReturn,
} from './property'

/**
 * Finished schema for further use in object parsing.
 *
 * When you use functions for creating schema, you transfer the `RawSchema`
 * to options and get the `Schema` type which building by the raw schema.
 *
 * Note:
 * - If you use an array as `RawSchema`, you get `any` type. Currently, the
 * array type is not supported.
 *
 * ### Example
 *
 * ```typescript
 * const obj = { a1: String, b1: { a2: [Number, Boolean] } }
 * type e = Schema<typeof obj>
 *
 * // Returns:
 * {
 *   a1: PropertySchema<StringConstructor[]>,
 *   b1: {
 *     a2: PropertySchema<(NumberConstructor | BooleanConstructor)[]>
 *   }
 * }
 * ```
 */
export type Schema<SRaw extends RawSchema = any> =
	SRaw extends RawSchemaAsObject ? SchemaAsObject<SRaw> : any

type SchemaAsObject<SRaw extends RawSchemaAsObject> = {
	[P in keyof SRaw]: SchemaTypeProperty<SRaw[P]>
}

type SchemaTypeProperty<P> = P extends PropertyTypeRaw
	? PropertySchema<PropertyTypeNormalize<P>, any, true>
	: P extends PropertySchema
	? P
	: P extends RawSchemaAsObject
	? Schema<P>
	: never

/**
 * The raw schema for describing handled schema. This type allows
 * using more types to describe a schema.
 *
 * ### Example
 *
 * As an array:
 * ```typescript
 * ['a1.a2.a3', 'b1', 'c1']
 * ```
 *
 * As an object:
 * ```typescript
 * {
 *  a1: String,
 *  b1: [String, Number],
 *  c1: {
 *    a2: Number,
 *    b2: createPropertySchema(null),
 *    c2: null
 *  }
 * }
 * ```
 */
export type RawSchema = RawSchemaAsArray | RawSchemaAsObject

/**
 * Raw schema as an array.
 */
export type RawSchemaAsArray = string[]

/**
 * Raw schema as an object.
 */
export type RawSchemaAsObject = {
	[key: string]: RawSchemaProperty
}

/**
 * Property of raw schema if the schema is an object.
 */
export type RawSchemaProperty =
	| PropertyTypeRaw
	| PropertySchema
	| RawSchemaAsObject

/**
 * Returns final object type by the schema.
 *
 * ```typescript
 * const obj = { a1: String, b1: { a2: [Number, Boolean] } }
 * type e = SchemaReturn<Schema<typeof obj>>
 *
 * // Returns:
 * {
 *   a1: string,
 *   b1: {
 *     a2: number | boolean
 *   }
 * }
 * ```
 */
export type SchemaReturn<S extends Schema = any> = {
	[P in keyof S]: SchemaReturnProperty<S[P]>
}

type SchemaReturnProperty<P> = P extends PropertySchema
	? PropertySchemaReturn<P>
	: P extends PropertyTypeRaw
	? PropertySchemaReturn<PropertySchema<PropertyTypeNormalize<P>>>
	: SchemaReturn<P>
