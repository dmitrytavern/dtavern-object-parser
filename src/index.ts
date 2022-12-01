import { parseValue } from './parseValue'
import { parseOptions } from './parseOptions'
import { AsyncFunction } from './isEqualConstructor'
import { createSchema, isSchema } from './schema/createSchema'
import {
	createSchemaProperty,
	isSchemaProperty,
} from './schema/createSchemaProperty'

export { parseValue } from './parseValue'
export { parseOptions } from './parseOptions'
export { AsyncFunction } from './isEqualConstructor'
export { createSchema, isSchema } from './schema/createSchema'
export {
	createSchemaProperty,
	isSchemaProperty,
} from './schema/createSchemaProperty'

export const options = {
	parse: parseOptions,
	single: parseValue,
	createSchema,
	createSchemaProperty,
	isSchema,
	isSchemaProperty,
	AsyncFunction,
}

export default options
