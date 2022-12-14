import { parseProperty } from './lib/parseProperty'
import { parseProperties } from './lib/parseProperties'
import { createSchema } from './lib/createSchema'
import { createPropertySchema } from './lib/createPropertySchema'
import { isSchema, isPropertySchema } from './utils/schema'

import { hasOwn, isArray, isFunction, isObject } from './utils/shared'
import {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
	isPrimitiveConstructors,
} from './utils/constructors'

export { parseProperty } from './lib/parseProperty'
export { parseProperties } from './lib/parseProperties'
export { createSchema } from './lib/createSchema'
export { createPropertySchema } from './lib/createPropertySchema'
export { isSchema, isPropertySchema } from './utils/schema'

/**
 * @public
 */
export const utils = {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
	isPrimitiveConstructors,
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
