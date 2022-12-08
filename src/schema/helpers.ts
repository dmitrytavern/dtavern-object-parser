import { metadata } from 'src/utils/metadata'

export const isSchema = (object: any): boolean =>
	metadata.get(object, 'isSchema')

export const isPropertySchema = (object: object): boolean =>
	metadata.get(object, 'isPropertySchema')

export const isHandledSchema = (object: object): boolean =>
	metadata.get(object, 'isHandledSchema')

export const isArrayTypeSchema = (object: object): boolean =>
	metadata.get(object, 'isArrayType')
