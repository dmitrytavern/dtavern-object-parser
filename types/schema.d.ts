/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	OptionSettings,
	OptionTypeSetting,
	OptionConstructorReturn,
} from './option'

/**
 * Schema type
 */
export type Schema = SchemaAsArray | SchemaAsObject

export type SchemaAsArray = string[]

export type SchemaAsObject = {
	[Key in string]: SchemaProperty
}

export type SchemaProperty =
	| SchemaAsObject
	| OptionTypeSetting<any>
	| OptionSettings<any>

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
	Property extends OptionSettings<any>
		? OptionConstructorReturn<Required<Property>['type']>
		: SchemaReturn<Property>
