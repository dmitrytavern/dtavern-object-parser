import { metadata } from 'src/utils/metadata'

/**
 * @public
 */
export const isSchema = (object: any): boolean =>
	metadata.get(object, 'isSchema')

/**
 * @public
 */
export const isPropertySchema = (object: any): boolean =>
	metadata.get(object, 'isPropertySchema')

/**
 * @internal
 */
export const isHandledSchema = (object: any): boolean =>
	metadata.get(object, 'isHandledSchema')

/**
 * @internal
 */
export const isArrayTypeSchema = (object: any): boolean =>
	metadata.get(object, 'isArrayType')
