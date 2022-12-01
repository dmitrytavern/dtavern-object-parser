import { parseProperty } from './lib/parseProperty'
import { parseProperties } from './lib/parseProperties'
import { isSchema, createSchema } from './schema/createSchema'
import {
	isSchemaProperty,
	createSchemaProperty,
} from './schema/createSchemaProperty'

import { AsyncFunction, compareConstructors } from './utils/constructor'
import { hasOwn, isArray, isFunction, isObject } from './utils/objects'

export { parseProperty } from './lib/parseProperty'
export { parseProperties } from './lib/parseProperties'
export { createSchema, isSchema } from './schema/createSchema'
export {
	createSchemaProperty,
	isSchemaProperty,
} from './schema/createSchemaProperty'

export const utils = {
	AsyncFunction,
	compareConstructors,
	hasOwn,
	isArray,
	isObject,
	isFunction,
}

export const options = {
	parse: parseProperties,
	single: parseProperty,
	schema: createSchema,
	property: createSchemaProperty,
	isSchema,
	isSchemaProperty,
	utils,
}

export default options
