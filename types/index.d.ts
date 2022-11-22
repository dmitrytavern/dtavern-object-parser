export type SchemaOptionRequired = boolean

export type SchemaOptionConstructor<T> =
	| { (): T }
	| { new (...args: never[]): T & object }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| { new (...args: string[]): any }

export type SchemaOptionTypes<T> =
	| null
	| SchemaOptionConstructor<T>
	| SchemaOptionConstructor<T>[]

export type SchemaOptionDefault<T> =
	| T
	| null
	| undefined
	| (() => T | null | undefined)

export interface SchemaOptionValidator<T> {
	(value: T): boolean
}

export type SchemaOptionSettings<T> = {
	type?: SchemaOptionTypes<T>
	default?: SchemaOptionDefault<T>
	required?: SchemaOptionRequired
	validator?: SchemaOptionValidator<T>
}

export type SchemaOption<Option> = SchemaOptionTypes<Option>

export type SchemaAsArray<Options> = string[] | (keyof Options)[]
export type SchemaAsObject<Options> = {
	[Option in keyof Options]: SchemaOption<Option>
}
export type Schema<Options> = SchemaAsArray<Options> | SchemaAsObject<Options>

export type ConfigMode = 'strict' | 'log' | 'disabled'
export interface Config {
	mode?: ConfigMode
	clone?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFunctionType = (...args: any[]) => Promise<boolean>

export const AsyncFunction: AsyncFunctionType

export function schemaProperty<Type>(
	schemaOptionSettings: SchemaOptionSettings<Type>
): SchemaOptionSettings<Type>

export function parseOptions<Options, Return = Required<Options>>(
	options: Options,
	optionsSchema: Schema<Options>,
	config?: Config
): Return

export const options: {
	parseOptions: typeof parseOptions
	schemaProperty: typeof schemaProperty
	AsyncFunction: typeof AsyncFunction
}

export default options
