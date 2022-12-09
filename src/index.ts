import { parseProperty } from './lib/parseProperty'
import { parseProperties } from './lib/parseProperties'
import { createSchema } from './schema/createSchema'
import { createPropertySchema } from './schema/createPropertySchema'
import { isSchema, isPropertySchema } from './schema/helpers'

import { hasOwn, isArray, isFunction, isObject } from './utils/objects'
import {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
} from './utils/constructors'

export { parseProperty } from './lib/parseProperty'
export { parseProperties } from './lib/parseProperties'
export { createSchema } from './schema/createSchema'
export { createPropertySchema } from './schema/createPropertySchema'
export { isSchema, isPropertySchema } from './schema/helpers'

/**
 * @public
 */
export const utils = {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
	hasOwn,
	isArray,
	isObject,
	isFunction,
}

/**
 * @public
 */
export const parser = {
	parse: parseProperties,
	single: parseProperty,
	schema: createSchema,
	property: createPropertySchema,
	isSchema,
	isProperty: isPropertySchema,
	utils,
}

export default parser
