import {
	createSchema,
	isSchema,
	isSchemaProperty,
} from '../../dist/object-parser'

const schemaFn = createSchema
const isSchemaFn = isSchema
const isPropertyFn = isSchemaProperty

it('is schema', () => {
	const schema_by_array = schemaFn({})
	const schema_by_object = schemaFn([])

	expect(isSchemaFn(schema_by_array)).toBeTruthy()
	expect(isSchemaFn(schema_by_object)).toBeTruthy()
})

it('is nested schema', () => {
	const schema = schemaFn({ a1: { a2: String } })

	expect(isSchemaFn(schema.a1)).toBeTruthy()
	expect(isPropertyFn(schema.a1.a2)).toBeTruthy()
})

it('raw schama as array', () => {
	const schema = schemaFn(['a1', 'b1', 'c1'])

	expect(isPropertyFn(schema.a1)).toBeTruthy()
	expect(isPropertyFn(schema.b1)).toBeTruthy()
	expect(isPropertyFn(schema.c1)).toBeTruthy()
})

it('raw schema as array with nested properties', () => {
	const schema = schemaFn(['a1', 'a1.a2.a3', 'a1.a2', 'a1'])

	expect(isSchemaFn(schema.a1)).toBeTruthy()
	expect(isSchemaFn(schema.a1.a2)).toBeTruthy()
	expect(isPropertyFn(schema.a1.a2.a3)).toBeTruthy()
})

describe('combine schemas', () => {
	const user_schema = schemaFn({ name: String, age: Number })
	const response_schema = schemaFn({ status: Number, user: user_schema })

	it('response schema exists user schema', () => {
		expect(isSchemaFn(response_schema.user)).toBeTruthy()
		expect(isPropertyFn(response_schema.user.name)).toBeTruthy()
	})

	it('user schemas is equals', () => {
		expect(user_schema).toStrictEqual(response_schema.user)
	})
})

it('check schema immutable', () => {
	const schema = schemaFn({ a1: String, b1: { a2: String } })

	expect(() => {
		schema.a1 = Number
	}).toThrow()
	expect(() => {
		schema['b1'] = {}
	}).toThrow()
	expect(() => {
		delete schema['a1']
	}).toThrow()
	expect(() => {
		Object.defineProperty(schema, 'b1', { value: {} })
	}).toThrow()
})
