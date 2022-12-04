import { ConstructorReturn, ArrayConstructorType } from './constructor'
import { PropertyOptions, PropertyType } from './options'

/**
 * Schema type
 */
export type Schema<RawSchema = any> = RawSchema extends RawSchemaAsArray
	? any
	: RawSchema extends RawSchemaAsObject
	? SchemaObject<RawSchema>
	: never

type SchemaArray<RawSchema extends RawSchemaAsArray> = RawSchema

type SchemaObject<RawSchema extends RawSchemaAsObject> = {
	[Property in keyof RawSchema]: SchemaTypeProperty<RawSchema[Property]>
}

type SchemaTypeProperty<Property> = Property extends PropertyType
	? PropertyOptions<Property, any, true, any, any>
	: Property extends PropertyOptions
	? Property
	: Schema<Property>

/**
 * Raw schema
 */
export type RawSchema = RawSchemaAsArray | RawSchemaAsObject

export type RawSchemaAsArray = string[]

export type RawSchemaAsObject = {
	[key: string]: RawSchemaProperty
}

type RawSchemaProperty = PropertyType | PropertyOptions | RawSchemaAsObject

/**
 * Return schema type
 */
export type SchemaReturn<RawSchemaObject = any> = {
	[Key in keyof RawSchemaObject]: SchemaReturnProperty<RawSchemaObject[Key]>
}

type SchemaReturnProperty<Property> = Property extends PropertyType<any>
	? ConstructorReturn<Property>
	: SchemaReturnPropertyAsOptions<Property>

type SchemaReturnPropertyAsOptions<Property> = Property extends PropertyOptions
	? Property['required'] extends true
		? SchemaContructorReturnArray<Property>
		: SchemaContructorReturnArray<Property> | undefined
	: SchemaReturn<Property>

type SchemaContructorReturnArray<Property extends PropertyOptions> = Extract<
	Property['type'],
	ArrayConstructorType
> extends never
	? ConstructorReturn<Property['type']>
	: SchemaReturnProperty<Property['typeElement']>[]
