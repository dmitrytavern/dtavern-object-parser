import { parseProperty } from './lib/parseProperty'
import { parseProperties } from './lib/parseProperties'
import { isSchema, createSchema } from './schema/createSchema'
import {
	isSchemaProperty,
	createSchemaProperty,
} from './schema/createSchemaProperty'

import { hasOwn, isArray, isFunction, isObject } from './utils/objects'
import {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
} from './utils/constructor'

export { parseProperty } from './lib/parseProperty'
export { parseProperties } from './lib/parseProperties'
export { createSchema, isSchema } from './schema/createSchema'
export {
	isSchemaProperty,
	createSchemaProperty,
} from './schema/createSchemaProperty'

export const utils = {
	AsyncFunction,
	GeneratorFunction,
	compareConstructors,
	hasOwn,
	isArray,
	isObject,
	isFunction,
}

export const parser = {
	parse: parseProperties,
	single: parseProperty,
	schema: createSchema,
	property: createSchemaProperty,
	isSchema,
	isProperty: isSchemaProperty,
	utils,
}

export default parser
