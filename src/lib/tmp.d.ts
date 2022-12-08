import { RawSchema, Schema } from '@types'

export type Props = null | undefined | any[] | object
export type PropsSchema = RawSchema | Schema
export type ReadonlyProps = Props
export type WritableProps = Props & object
export type PropKey = string | number
