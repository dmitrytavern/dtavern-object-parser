/**
 * @description
 * This declaration file provides types for describing
 * the property schema.
 *
 * Generic names conventions:
 * 	`T`    - Type of object property.
 * 	`TRaw` - Raw type of object property.
 * 	`E`    - Type of array element (only when type has Array type).
 * 	`ERaw` - Raw type of array element (only when type has Array type).
 * 	`R`    - Required type of object property.
 * 	`RRaw` - Raw required type of object property.
 *
 * Generic order: `<T, E, R>`.
 *
 * Generic default value: `<any, any, any>`.
 */

import { Schema, RawSchema, SchemaReturn } from './schema'
import {
	Constructor,
	ArrayConstructor,
	ConstructorReturn,
	HaveArrayConstructor,
} from './constructors'

/**
 * Finished property schema for further parsing.
 *
 * When you use functions for creating property schema, you transfer
 * the `PropertySchemaRaw` and get the `PropertySchema` type.
 *
 * Note: if `Type` has an array type, the property will have an `element` key.
 *
 * Generics: `<Type, ElementType, Required, Default, Validator>`.
 *
 * ### Example
 *
 * ```typescript
 * const schema: PropertySchema<
 *   typeof Array[],
 *   PropertySchema<typeof String[], null, true>,
 *   true,
 * > = {
 *   type: [Array],
 *   element: {
 *     type: [String],
 *     required: true,
 *     default: null,
 *     validator: null,
 *     skipDefaultValidate: flase
 *   },
 *   required: true,
 *   default: null,
 *   validator: null,
 *   skipDefaultValidate: flase
 * }
 * ```
 *
 * @public
 */
export type PropertySchema<
	T extends PropertyType = any,
	E extends PropertyElementType = any,
	R extends PropertyRequired = any
> = HaveArrayConstructor<T> extends true
	? Required<PropertySchemaTemplate<T, E, R>>
	: Required<Omit<PropertySchemaTemplate<T, E, R>, 'element'>>

/**
 * For creating the `PropertySchema` object you need to pass some options
 * to the create function. For this case use the `PropertySchemaRaw` object
 * where all properties are not required, not readonly, and have `Raw`
 * type versions.
 *
 * Note: if `Type` has an array type, the property will have an `element` key.
 *
 * Generics: `<TypeRaw, ElementTypeRaw, RequiredRaw, Default, Validator>`.
 *
 * ### Example
 *
 * ```typescript
 * const rawSchema: PropertySchemaRaw<typeof Array, typeof String> = {
 *   type: Array,
 *   element: String,
 * }
 * ```
 *
 * @public
 */
export type PropertySchemaRaw<
	TRaw extends PropertyTypeRaw = any,
	ERaw extends PropertyElementTypeRaw = any,
	RRaw extends PropertyRequiredRaw = any
> = HaveArrayConstructor<TRaw> extends true
	? PropertySchemaTemplate<TRaw, ERaw, RRaw>
	: Omit<PropertySchemaTemplate<TRaw, ERaw, RRaw>, 'element'>

/**
 * Finished type of property `type` key.
 *
 * ### Example
 *
 * ```typescript
 * const type: PropertyType = [String, Array, Number]
 * ```
 *
 * @public
 */
export type PropertyType<T = any> = Constructor<T>[]

/**
 * Raw type of property `type` key.
 *
 * ### Example
 *
 * ```typescript
 * const rawType: PropertyTypeRaw = null
 * const rawType: PropertyTypeRaw = String
 * const rawType: PropertyTypeRaw = [String]
 * ```
 *
 * @public
 */
export type PropertyTypeRaw<T = any> =
	| null
	| undefined
	| Constructor<T>
	| Constructor<T>[]

/**
 * Normalize helper for transforming `PropertyTypeRaw` to `PropertyType`.
 *
 * ### Example
 *
 * ```typescript
 * const rawType: PropertyTypeRaw = String
 * const type: PropertyTypeNormalize<typeof rawType> = [String]
 * ```
 *
 * @public
 */
export type PropertyTypeNormalize<TRaw extends PropertyTypeRaw> =
	TRaw extends any[] ? TRaw : TRaw extends Constructor ? [TRaw] : any

/**
 * Finished type of property `required` key.
 * @public
 */
export type PropertyRequired = boolean

/**
 * Raw type of property `required` key.
 * @public
 */
export type PropertyRequiredRaw = null | undefined | boolean

/**
 * Normalize helper for transforming `PropertyRequiredRaw` to `PropertyRequired`.
 *
 * ### Example
 *
 * ```typescript
 * const rawRequired: PropertyRequiredRaw = null
 * const required: PropertyRequiredNormalize<typeof rawRequired> = false
 * ```
 *
 * @public
 */
export type PropertyRequiredNormalize<RRaw extends PropertyRequiredRaw> =
	RRaw extends null | undefined ? false : RRaw

/**
 * Finished type of property `element` key.
 *
 * ### Example
 *
 * ```typescript
 * const el: PropertyElementType = createSchema({})
 * const el: PropertyElementType = createPropertySchema(null)
 * ```
 *
 * @public
 */
export type PropertyElementType = PropertySchema | Schema

/**
 * Raw type of property `element` key.
 *
 * Note: raw type can't be an object which not a schema.
 *
 * ### Example
 *
 * ```typescript
 * const el: PropertyElementTypeRaw = null
 * const el: PropertyElementTypeRaw = String
 * const el: PropertyElementTypeRaw = createSchema({})
 * const el: PropertyElementTypeRaw = createPropertySchema(null)
 * ```
 *
 * @public
 */
export type PropertyElementTypeRaw =
	| PropertyTypeRaw
	| PropertySchema
	| RawSchema
	| Schema

/**
 * Normalize helper for transforming `PropertyElementTypeRaw` to
 * `PropertyElementType`.
 *
 * Note: `PropertyElementTypeRaw` is not a generic type.
 *
 * ### Example
 *
 * ```typescript
 * // Normalize from raw type
 * const el: PropertyElementNormalize<
 *   PropertyTypeRaw<String>
 * > = {
 *   type: [String],
 *   required: true,
 *   default: null,
 *   validator: null
 * }
 *
 * // Normalize from property schema
 * const el: PropertyElementNormalize<
 *   PropertySchema<typeof String[]>
 * > = {
 *   type: [String],
 *   required: true,
 *   default: null,
 *   validator: null,
 * }
 *
 * // Normalize from schema
 * const rawSchema = {
 *   hello: [String]
 * }
 * const el: PropertyElementNormalize<typeof rawSchema> = {
 *   hello: {
 *     type: [String],
 *     required: true,
 *     default: null,
 *     validator: null
 *   }
 * }
 * ```
 *
 * @public
 */
export type PropertyElementNormalize<ERaw extends PropertyElementTypeRaw> =
	ERaw extends PropertyTypeRaw
		? PropertySchema<PropertyTypeNormalize<ERaw>, any, true>
		: ERaw extends PropertySchema
		? ERaw
		: ERaw extends RawSchema
		? Schema<ERaw>
		: never

/**
 * Type of property `default` key.
 * @public
 */
export type PropertyDefault<
	T extends PropertyType,
	E extends PropertyElementType
> =
	| null
	| PropertyContructorReturn<T, E>
	| (() => PropertyContructorReturn<T, E>)

/**
 * Type of property `validator` key.
 * @public
 */
export type PropertyValidator<
	T extends PropertyType,
	E extends PropertyElementType
> = null | ((value: PropertyContructorReturn<T, E>) => boolean)

/**
 * Template with all keys of property schema.
 * @public
 */
export type PropertySchemaTemplate<
	T extends PropertyType | PropertyTypeRaw = any,
	E extends PropertyElementType | PropertyElementTypeRaw = any,
	R = any
> = {
	type?: T
	element?: E
	required?: R
	default?: PropertyDefault<
		PropertyTypeNormalize<T>,
		PropertyElementNormalize<E>
	>
	validator?: PropertyValidator<
		PropertyTypeNormalize<T>,
		PropertyElementNormalize<E>
	>
	skipDefaultValidate?: boolean
}

/**
 * Returns the property type by the property schema.
 *
 * ### Example
 *
 * ```typescript
 * // Get property type
 * const result: PropertySchemaReturn<
 *   PropertySchema<typeof String[]>
 * > = 'Hello World'
 *
 * // Get property type as an array
 * const result: PropertySchemaReturn<
 *   PropertySchema<
 *     typeof Array[],
 *     PropertySchema<typeof Number[], any, true>,
 *     true
 *   >
 * > = [1, 2, 3]
 * ```
 *
 * @public
 */
export type PropertySchemaReturn<P extends PropertySchema> =
	HaveArrayConstructor<P['type']> extends true
		? // @ts-ignore
		  PropertyContructorReturn<P['type'], P['element']>
		: PropertyContructorReturn<P['type'], never>

/**
 * Returns the property type by types in the property schema.
 * @public
 */
type PropertyContructorReturn<
	T extends PropertyType,
	E extends PropertyElementType
> = T extends (infer Type)[]
	? Type extends ArrayConstructor
		? PropertyContructorReturnAsArray<E>[]
		: ConstructorReturn<Type>
	: never

/**
 * Returns type of an array element.
 *
 * Note:
 * - If the `element` type has an array type, the property type is an
 * array in an array
 * - If the `element` is `PropertySchema` then returns the type of
 * `type` key.
 * - If the `element` is `Schema` then returns the schema.
 * @public
 */
type PropertyContructorReturnAsArray<E extends Schema | PropertySchema> =
	E extends PropertySchema
		? E['type'] extends (infer Type)[]
			? Type extends ArrayConstructor
				? E['required'] extends false
					? // @ts-ignore
					  PropertyContructorReturn<E['type'], E['element']> | undefined
					: // @ts-ignore
					  PropertyContructorReturn<E['type'], E['element']>
				: E['required'] extends false
				? ConstructorReturn<Type> | undefined
				: ConstructorReturn<Type>
			: never
		: SchemaReturn<E>
