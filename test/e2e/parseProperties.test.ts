// @ts-nocheck

import {
	parseProperties,
	createSchema,
	createPropertySchema,
} from '../../dist/object-parser.js'

const parseFn = parseProperties
const schemaFn = createSchema
const propertyFn = createPropertySchema

describe('e2e: parse object', () => {
	const role_schema = schemaFn({
		id: Number,
		roleName: String,
		rolePriority: Number,
	})

	const roles_schema = propertyFn({
		type: Array,
		typeElement: role_schema,
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
		expect(parseFn(user_object, user_schema)).toStrictEqual(user_object)
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

		const cloneObject = parseFn(object, schema, config)

		cloneObject.a1 = 'Any'
		cloneObject.b1 = 123
		cloneObject.c1.a2 = 'Any'

		expect(object.a1).toBe('Jack')
		expect(object.b1).toBe(23)
		expect(object.c1.a2).toBe('Any')
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

		const cloneObject = parseFn(object, schema, config)

		cloneObject.a1.a2.a3.a4.hello = 'Any'

		expect(object.a1.a2.a3.a4.hello).toBe('Hello world')
		expect(cloneObject.a1.a2.a3.a4.hello).toBe('Any')
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

		const cloneObject = parseFn(object, schema, config)

		cloneObject.a1[0] = 'any'

		expect(object.a1).toStrictEqual([...arr])
		expect(cloneObject.a1[0]).toBe('any')
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

		const cloneObject = parseFn(object, schema, config)

		expect(object.b1).toBeUndefined()
		expect(cloneObject.b1).toStrictEqual(arr)
	})
})
