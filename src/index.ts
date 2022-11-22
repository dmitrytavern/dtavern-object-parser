import { parseOptions } from './parseOptions'
import { schemaProperty } from './schema'
import { AsyncFunction } from './isEqualConstructor'

export { AsyncFunction } from './isEqualConstructor'
export { schemaProperty } from './schema'
export { parseOptions } from './parseOptions'

export const options = {
	parse: parseOptions,
	schemaProperty,
	AsyncFunction,
}

export default options
