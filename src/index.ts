import { parseOptions } from './parseOptions'
import { schemaProperty } from './schema'
import { AsyncFunction } from './isEqualConstructor'
import { parseValue } from './parseOptionsBySchema'

export { parseOptions } from './parseOptions'
export { schemaProperty } from './schema'
export { AsyncFunction } from './isEqualConstructor'
export { parseValue } from './parseOptionsBySchema'

export const options = {
	parse: parseOptions,
	single: parseValue,
	schemaProperty,
	AsyncFunction,
}

export default options
