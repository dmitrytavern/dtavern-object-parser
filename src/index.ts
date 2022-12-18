import { parseProperty } from './lib/parseProperty'
import { parseProperties } from './lib/parseProperties'
import { createSchema, useSchema } from './lib/createSchema'
import { isSchema, isPropertySchema } from './utils/schema'
import {
	createPropertySchema,
	usePropertySchema,
} from './lib/createPropertySchema'

import {
	isDefined,
	isUndefined,
	hasOwn,
	isArray,
	isFunction,
	isObject,
} from './utils/shared'
import {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
	isPrimitiveConstructors,
	containsArrayConstructor,
} from './utils/constructors'

export { parseProperty } from './lib/parseProperty'
export { parseProperties } from './lib/parseProperties'
export { createSchema } from './lib/createSchema'
export {
	createPropertySchema,
	usePropertySchema,
} from './lib/createPropertySchema'
export { isSchema, isPropertySchema } from './utils/schema'

/**
 * Package utils.
 *
 * @public
 */
export const utils = {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	getConstructors,
	isConstructors,
	isPrimitiveConstructors,
	containsArrayConstructor,
	hasOwn,
	isArray,
	isObject,
	isFunction,
	isDefined,
	isUndefined,
}

/**
 * Parser main functions.
 *
 * @public
 */
export const parser = {
	parse: parseProperties,
	single: parseProperty,
	schema: createSchema,
	property: createPropertySchema,
	useSchema: useSchema,
	useProperty: usePropertySchema,
	isSchema,
	isProperty: isPropertySchema,
	utils,
}

export default parser
