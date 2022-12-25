// @ts-nocheck

import { parser } from '../../dist/object-parser.js'

const parseFn = parser.parse
const parseAsyncFn = parser.parseAsync
const schemaFn = parser.schema
const propertyFn = parser.property

describe('e2e: parse object', () => {
	const role_schema = schemaFn({
		id: Number,
		roleName: String,
		rolePriority: Number,
	})

	const roles_schema = propertyFn({
		type: Array,
		element: role_schema,
	})

	const flags_schema = propertyFn({
		type: Object,
		required: false,
		default: () => ({}),
	})

	const user_schema = schemaFn({
		id: Number,
		name: String,
		roles: roles_schema,
		flags: flags_schema,
		balance: propertyFn({
			type: Number,
			required: true,
			validator: (val) => val >= 0,
		}),
	})

	const user_object = {
		id: 123,
		name: 'Jack',
		balance: 0,
		roles: [
			{
				id: 0,
				roleName: 'admin',
				rolePriority: 999,
			},
			{
				id: 1,
				roleName: 'user',
				rolePriority: 1,
			},
		],
	}

	it('should parse object without errors', () => {
		const { value, errors } = parseFn(user_object, user_schema)
		expect(value).toStrictEqual(user_object)
		expect(errors.length).toBe(0)
	})
})

describe('e2e: copy object', () => {
	const config = { clone: true }

	it('standart copy', () => {
		const object_link = { a2: 'Deep object' }
		const object = {
			a1: 'Jack',
			b1: 23,
			c1: object_link,
		}

		const schema = schemaFn({
			a1: String,
			b1: Number,
			c1: Object,
		})

		const { value: cloneObject, errors } = parseFn(object, schema, config)

		cloneObject.a1 = 'Any'
		cloneObject.b1 = 123
		cloneObject.c1.a2 = 'Any'

		expect(object.a1).toBe('Jack')
		expect(object.b1).toBe(23)
		expect(object.c1.a2).toBe('Any')
		expect(errors.length).toBe(0)
	})

	it('deep copy', () => {
		const object = {
			a1: {
				a2: {
					a3: {
						a4: {
							hello: 'Hello world',
						},
					},
				},
			},
		}

		const schema = schemaFn({
			a1: {
				a2: {
					a3: {
						a4: {
							hello: String,
						},
					},
				},
			},
		})

		const { value: cloneObject, errors } = parseFn(object, schema, config)

		cloneObject.a1.a2.a3.a4.hello = 'Any'

		expect(object.a1.a2.a3.a4.hello).toBe('Hello world')
		expect(cloneObject.a1.a2.a3.a4.hello).toBe('Any')
		expect(errors.length).toBe(0)
	})
})

describe('e2e: copy array', () => {
	const arr = ['hello', 'world']
	const config = { clone: true }

	it('deep copy', () => {
		const object: any = { a1: [...arr] }
		const schema = schemaFn({
			a1: Array,
		})

		const { value: cloneObject, errors } = parseFn(object, schema, config)

		cloneObject.a1[0] = 'any'

		expect(object.a1).toStrictEqual([...arr])
		expect(cloneObject.a1[0]).toBe('any')
		expect(errors.length).toBe(0)
	})

	it('default copy', () => {
		const object: any = {}
		const schema = schemaFn({
			b1: propertyFn({
				type: Array,
				required: false,
				default: () => [...arr],
			}),
		})

		const { value: cloneObject, errors } = parseFn(object, schema, config)

		expect(object.b1).toBeUndefined()
		expect(cloneObject.b1).toStrictEqual(arr)
		expect(errors.length).toBe(0)
	})
})

describe('e2e: async parser', () => {
	const user_schema = schemaFn({ id: Number, name: String })
	const user_object = { id: 123, name: 'Jack' }

	it('should parse object', async () => {
		const object = await parseAsyncFn(user_object, user_schema)
		expect(object).toStrictEqual(user_object)
	})

	it('should throws an error', async () => {
		try {
			await parseAsyncFn({}, user_schema)
		} catch (errors) {
			expect(errors.length).toBe(2)
		}
	})
})
