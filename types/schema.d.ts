import {
	OptionSettings,
	OptionTypeSetting,
	OptionConstructorReturn,
} from './option'

/**
 * Schema type
 */
export type Schema = {
	[key: string]: Schema | SchemaOptionSettings
}

export type SchemaType<Schema> = {
	[Property in keyof Schema]: SchemaTypeProperty<Schema[Property]>
}

type SchemaTypeProperty<Property> = Property extends OptionTypeSetting<any>
	? OptionSettings<Property, any, true, any>
	: Property extends SchemaOptionSettings
	? Property
	: SchemaType<Property>

/**
 * Raw schema
 */
export type RawSchema = RawSchemaAsArray | RawSchemaAsObject

export type RawSchemaAsArray = string[]

export type RawSchemaAsObject = {
	[key: string]: RawSchemaProperty
}

export type RawSchemaProperty =
	| OptionTypeSetting<any>
	| SchemaOptionSettings
	| RawSchemaAsObject

/**
 * Return schema type
 */
export type SchemaReturn<Schema> = {
	[Option in keyof Schema]: SchemaReturnProperty<Schema[Option]>
}

export type SchemaReturnProperty<Property> =
	Property extends OptionTypeSetting<any>
		? SchemaReturnPropertyAsType<Property>
		: SchemaReturnPropertyAsSettings<Property>

type SchemaReturnPropertyAsType<Constructor> =
	OptionConstructorReturn<Constructor>

type SchemaReturnPropertyAsSettings<Property> =
	Property extends SchemaOptionSettings
		? Property['required'] extends true
			? OptionConstructorReturn<Property['type']>
			: OptionConstructorReturn<Property['type']> | undefined
		: SchemaReturn<Property>

type SchemaOptionSettings = OptionSettings<any, any, any, any>
