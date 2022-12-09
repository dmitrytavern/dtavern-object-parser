import { Schema, RawSchema } from './schema'

export * from './constructor'
export * from './functions'
export * from './options'
export * from './schema'
export * from './config'

export type ParsePropertyResponse = {
	isChanged: boolean
	value: any
}

export type Props = null | undefined | any[] | object
export type PropsSchema = RawSchema | Schema
export type ReadonlyProps = Props
export type WritableProps = Props & object
export type PropKey = string | number
