// @ts-nocheck

import { parser } from '../../dist/object-parser'

const schemaFn = parser.schema
const propertyFn = parser.property
const isSchemaFn = parser.isSchema
const isPropertyFn = parser.isProperty
const defaultSchema = {
  type: [],
  element: null,
  required: true,
  default: null,
  validator: null,
  skipDefaultValidate: false,
}

it('should be a property schema', () => {
  expect(isSchemaFn(propertyFn({}))).toBeFalsy()
  expect(isPropertyFn(propertyFn({}))).toBeTruthy()
})

describe('empty settings', () => {
  it('should return a default property schema', () => {
    expect(propertyFn(null)).toEqual(defaultSchema)
    expect(propertyFn(undefined)).toEqual(defaultSchema)
    expect(propertyFn({})).toEqual(defaultSchema)
    expect(
      propertyFn({
        type: undefined,
        element: undefined,
        required: undefined,
        default: undefined,
        validator: undefined,
      })
    ).toEqual({
      ...defaultSchema,
      required: false,
    })
  })

  it('should throw if settings is not correct type', () => {
    expect(() => propertyFn('')).toThrow()
    expect(() => propertyFn(false)).toThrow()
    expect(() => propertyFn([])).toThrow()
  })
})

describe('type setting', () => {
  it('should be empty array', () => {
    expect(propertyFn({ type: null })).toEqual({
      ...defaultSchema,
      type: [],
    })

    expect(propertyFn({ type: undefined })).toEqual({
      ...defaultSchema,
      type: [],
    })
  })

  it('should be an array with functions', () => {
    expect(propertyFn({ type: String })).toEqual({
      ...defaultSchema,
      type: [String],
    })

    expect(propertyFn({ type: [String, Number] })).toEqual({
      ...defaultSchema,
      type: [String, Number],
    })
  })

  it('should throw if type is not a function', () => {
    expect(() => propertyFn({ type: false })).toThrow()
    expect(() => propertyFn({ type: [false, 'sdf'] })).toThrow()
  })

  it('should throw if type is null in an array', () => {
    expect(() => propertyFn({ type: [null, String] })).toThrow()
  })

  it('should throw if is undefined in an array', () => {
    expect(() => propertyFn({ type: [undefined, String] })).toThrow()
  })
})

describe('default setting', () => {
  it('should be a primitive type', () => {
    const settings = propertyFn({ required: false, default: 'def' })

    expect(settings).toEqual({
      ...defaultSchema,
      required: false,
      default: 'def',
    })
  })

  it('should be a function', () => {
    const fn = () => 'def'
    const settings = propertyFn({ required: false, default: fn })

    expect(settings).toEqual({
      ...defaultSchema,
      required: false,
      default: fn,
    })
  })

  it('should throw if a type is no-primitive and default is not a function', () => {
    const fn = () =>
      propertyFn({
        type: [Object],
        required: false,
        default: {},
      })

    expect(fn).toThrow()
  })

  it('should throw if a type is any and default is an object', () => {
    expect(() =>
      propertyFn({
        required: false,
        default: {},
      })
    ).toThrow()

    expect(() =>
      propertyFn({
        required: false,
        default: [],
      })
    ).toThrow()
  })
})

describe('validator setting', () => {
  it('should be a function', () => {
    const fn = () => true
    const settings = propertyFn({ validator: fn })

    expect(settings).toEqual({
      ...defaultSchema,
      validator: fn,
    })
  })

  it('should throw if validator is not a function', () => {
    expect(() => propertyFn({ validator: false })).toThrow()
    expect(() => propertyFn({ validator: 'sdfsd' })).toThrow()
  })
})

describe('type element setting', () => {
  it('should be a default property schema', () => {
    const _null = propertyFn({ type: Array, element: null })
    const _emptyArray = propertyFn({ type: Array, element: [] })

    expect(isPropertyFn(_null.element)).toBeTruthy()
    expect(isPropertyFn(_emptyArray.element)).toBeTruthy()
  })

  it('should be a property schema with function type', () => {
    const _asFn = propertyFn({ type: Array, element: Number })
    const _asArray = propertyFn({ type: Array, element: [Number, String] })

    expect(_asFn.element.type).toEqual([Number])
    expect(_asArray.element.type).toEqual([Number, String])
  })

  it('should be a schema', () => {
    const _schema = propertyFn({
      type: Array,
      element: schemaFn({ a: { b: [String, Number] } }),
    })

    expect(isSchemaFn(_schema.element)).toBeTruthy()
    expect(isSchemaFn(_schema.element.a)).toBeTruthy()
    expect(isPropertyFn(_schema.element.a.b)).toBeTruthy()
  })

  it('should throw if type is array and type element is common object', () => {
    expect(() => propertyFn({ type: Array, element: {} })).toThrow()
    expect(() =>
      propertyFn({ type: Array, element: { a: { b: String } } })
    ).toThrow()
  })

  it('should throw if type is not array and type element have value', () => {
    expect(() => propertyFn({ type: Number, element: Number })).toThrow()
  })
})

describe('boolean setting keys', () => {
  const keys = ['required', 'skipDefaultValidate']

  const getFilledObject = (value: any) => {
    const obj = {}
    keys.map((key) => (obj[key] = value))
    return obj
  }

  it('should be true', () => {
    const result = { ...defaultSchema, ...getFilledObject(true) }

    expect(propertyFn(getFilledObject(true))).toEqual(result)
    expect(propertyFn(getFilledObject({}))).toEqual(result)
    expect(propertyFn(getFilledObject([]))).toEqual(result)
    expect(propertyFn(getFilledObject('value'))).toEqual(result)
  })

  it('should be false', () => {
    const result = { ...defaultSchema, ...getFilledObject(false) }

    expect(propertyFn(getFilledObject(false))).toEqual(result)
    expect(propertyFn(getFilledObject(''))).toEqual(result)
    expect(propertyFn(getFilledObject(null))).toEqual(result)
    expect(propertyFn(getFilledObject(undefined))).toEqual(result)
  })
})

describe('error handling', () => {
  it('throws when try change schema properties', () => {
    const settings = propertyFn({})

    expect(Object.isFrozen(settings)).toBeTruthy()
    expect(() => (settings.type = [String])).toThrow()
    expect(() => (settings['type'] = [String])).toThrow()
    expect(() => delete settings['type']).toThrow()
    expect(() =>
      Object.defineProperty(settings, 'type', { value: [String] })
    ).toThrow()
  })

  it('throws when try change type of a schema', () => {
    const settings = propertyFn({ type: [String, Number] })

    expect(Object.isFrozen(settings.type)).toBeTruthy()
    expect(settings.type[0]).toBe(String)
    expect(settings.type[2]).toBe(undefined)
    expect(() => (settings.type[0] = Boolean)).toThrow()
    expect(() => (settings.type[2] = Function)).toThrow()
    expect(() => settings.type.push(Object)).toThrow()
    expect(() => settings.type.pop()).toThrow()
    expect(() =>
      Object.defineProperty(settings.type, 3, { value: Symbol })
    ).toThrow()
  })
})
