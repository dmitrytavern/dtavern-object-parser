// @ts-nocheck

import { parser } from '../../dist/object-parser'

const schemaFn = parser.schema
const isSchemaFn = parser.isSchema
const isPropertyFn = parser.isProperty

it('should be a schema', () => {
  expect(isSchemaFn(schemaFn({}))).toBeTruthy()
  expect(isSchemaFn(schemaFn([]))).toBeTruthy()
  expect(isPropertyFn(schemaFn({}))).toBeFalsy()
  expect(isPropertyFn(schemaFn([]))).toBeFalsy()
})

it('should have a property schema', () => {
  expect(isPropertyFn(schemaFn({ a1: String }).a1)).toBeTruthy()
  expect(isPropertyFn(schemaFn(['a1']).a1)).toBeTruthy()
})

describe('nested schemas', () => {
  it('should return a nested schema from an object', () => {
    const schema = schemaFn({ a1: { a2: {} } })

    expect(isSchemaFn(schema.a1)).toBeTruthy()
    expect(isSchemaFn(schema.a1.a2)).toBeTruthy()
  })

  it('should return a nested schema from an array', () => {
    const schema = schemaFn(['a1', 'a1.a2.a3', 'a1.a2', 'a1'])

    expect(isSchemaFn(schema.a1)).toBeTruthy()
    expect(isSchemaFn(schema.a1.a2)).toBeTruthy()
    expect(isPropertyFn(schema.a1.a2.a3)).toBeTruthy()
  })
})

describe('combine schemas', () => {
  const user_schema = schemaFn({ name: String, age: Number })
  const response_schema = schemaFn({ status: Number, user: user_schema })

  it('should have nested schemas', () => {
    expect(isSchemaFn(response_schema)).toBeTruthy()
    expect(isSchemaFn(response_schema.user)).toBeTruthy()
    expect(isPropertyFn(response_schema.user.name)).toBeTruthy()
  })

  it('should equal with a nested schema', () => {
    expect(user_schema).toStrictEqual(response_schema.user)
  })
})

describe('error handling', () => {
  it('should throw when detect cycle objects', () => {
    const obj: any = {}
    obj.a1 = obj

    expect(() => schemaFn(obj)).toThrow()
  })

  it('throws when an argument is not an array or an object', () => {
    expect(() => schemaFn(null)).toThrow()
    expect(() => schemaFn(undefined)).toThrow()
    expect(() => schemaFn('')).toThrow()
    expect(() => schemaFn(false)).toThrow()
  })

  it('throws when try change schema properties', () => {
    const schema = schemaFn({ a1: String, b1: { a2: String } })

    expect(() => (schema.a1 = Number)).toThrow()
    expect(() => (schema['b1'] = {})).toThrow()
    expect(() => delete schema['a1']).toThrow()
    expect(() => Object.defineProperty(schema, 'b1', { value: {} })).toThrow()
  })
})
