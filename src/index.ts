import { parseOptions } from './parseOptions'
import { schemaProperty } from './schema'
import { AsyncFunction } from './isEqualConstructor'
import { parseValue } from './parseValue'

export { parseOptions } from './parseOptions'
export { schemaProperty } from './schema'
export { AsyncFunction } from './isEqualConstructor'
export { parseValue } from './parseValue'

export const options = {
	parse: parseOptions,
	single: parseValue,
	schemaProperty,
	AsyncFunction,
}

export default options
