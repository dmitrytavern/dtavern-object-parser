export type SchemaPropertyRequired = boolean

export type SchemaPropertyConstructor<T> =
	| { (): T }
	| { new (...args: never[]): T & object }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| { new (...args: string[]): any }

export type SchemaPropertyTypes<T> =
	| null
	| SchemaPropertyConstructor<T>
	| SchemaPropertyConstructor<T>[]

export type SchemaPropertyDefault<T> =
	| T
	| null
	| undefined
	| (() => T | null | undefined)

export interface SchemaPropertyValidator<T> {
	(value: T): boolean
}

export type SchemaPropertySettings<T> = {
	type?: SchemaPropertyTypes<T>
	default?: SchemaPropertyDefault<T>
	required?: SchemaPropertyRequired
	validator?: SchemaPropertyValidator<T>
}

export type SchemaProperty<Property> = SchemaPropertyTypes<Property>

export type SchemaObject<Properties> = {
	[Property in keyof Properties]: SchemaProperty<Property>
}
export type Schema<Properties> =
	| string[]
	| (keyof Properties)[]
	| SchemaObject<Properties>

export type ConfigMode = 'strict' | 'log' | 'disabled'
export interface Config {
	mode?: ConfigMode
	clone?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFunctionType = (...args: any[]) => Promise<boolean>

export const AsyncFunction: AsyncFunctionType

export function schemaProperty<Type>(
	schemaPropertySettings: SchemaPropertySettings<Type>
): SchemaPropertySettings<Type>

export function defineOptions<Properties, Return = Required<Properties>>(
	properties: Properties,
	propertiesSchema: Schema<Properties>,
	config?: Config
): Return

export default defineOptions
