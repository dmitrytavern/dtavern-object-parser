import { version } from './version'
import { Errors } from './utils/errors'
import { parseProperty } from './lib/parseProperty'
import { parseProperties, parsePropertiesAsync } from './lib/parseProperties'
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

export {
  Schema,
  SchemaReturn,
  SchemaReturnKeys,
  RawSchema,
  RawSchemaProperty,
  Constructor,
  ConstructorReturn,
  ArrayConstructor,
  AsyncFunctionConstructor,
  GeneratorFunctionConstructor,
  PropertyKey,
  PropertySchema,
  PropertySchemaRaw,
  PropertySchemaReturn,
} from '@types'

export {
  Errors,
  ObjectError,
  PropertyError,
  GeneralError,
} from './utils/errors'

export { version } from './version'
export { parseProperty as single } from './lib/parseProperty'
export {
  parseProperties as parse,
  parsePropertiesAsync as parseAsync,
} from './lib/parseProperties'
export {
  isSchema as isSchema,
  isPropertySchema as isProperty,
} from './utils/schema'
export {
  createSchema as schema,
  useSchema as useSchema,
} from './lib/createSchema'
export {
  createPropertySchema as property,
  usePropertySchema as useProperty,
} from './lib/createPropertySchema'

/**
 * Package utils.
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
  Errors,
}

/**
 * Parser main functions.
 * @public
 */
export const parser = {
  parse: parseProperties,
  parseAsync: parsePropertiesAsync,
  single: parseProperty,
  schema: createSchema,
  property: createPropertySchema,
  useSchema: useSchema,
  useProperty: usePropertySchema,
  isSchema,
  isProperty: isPropertySchema,
  utils,
  version,
}

export default parser
