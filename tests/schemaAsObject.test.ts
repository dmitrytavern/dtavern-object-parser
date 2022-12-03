import { parseProperties, createSchemaProperty } from '../dist/object-parser'

const parseFn = parseProperties
const propertyFn = createSchemaProperty

describe('Check schema as object', () => {
	it('schema property with correct type', () => {
		const object = parseFn({ name: 'Dmitry' }, { name: String })
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('schema property with wrong type', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, { name: Number })
		expect(fn).toThrow()
	})

	it('schema have not keys for object', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, {})
		expect(fn).toThrow()
	})

	it('schema property have some types as array', () => {
		const object = parseFn({ age: 13 }, { age: [Number, String] })
		expect(object).toEqual({ age: 13 })
	})

	it('schema property have any type', () => {
		const object = parseFn({ anyType: undefined }, { anyType: null })
		expect(object).toEqual({ anyType: undefined })
	})

	it('schema property have undefined type', () => {
		const fn = () => parseFn({ anyType: undefined }, { anyType: undefined })
		expect(fn).toThrow()
	})

	it('schema property have any type without property', () => {
		const fn = () => parseFn({}, { anyType: null })
		expect(fn).toThrow()
	})
})

describe('Check nested schemas', () => {
	it('options have all correct properties', () => {
		const object = parseFn(
			{
				name: 'Dmitry',
				contacts: {
					email: {
						name: 'helloworld',
						domain: 'gmail.com',
					},
					twitter: false,
				},
			},
			{
				name: String,
				contacts: {
					email: {
						name: String,
						domain: String,
					},
					twitter: [Boolean, String],
				},
			}
		)

		expect(object).toEqual({
			name: 'Dmitry',
			contacts: {
				email: {
					name: 'helloworld',
					domain: 'gmail.com',
				},
				twitter: false,
			},
		})
	})

	it('options have no nested objects', () => {
		const fn = () =>
			parseFn(
				{
					name: 'Dmitry',
					contacts: {
						email: {
							name: 'helloworld',
						},
						twitter: false,
					},
				},
				{
					name: String,
					contacts: {
						email: {
							name: String,
							domain: String,
						},
						twitter: [Boolean, String],
					},
				}
			)

		expect(fn).toThrow()
	})

	it('nested schema without keys', () => {
		const schema = {
			a: {
				b: {
					c: {
						d: {},
					},
				},
			},
		}

		const object = parseFn({}, schema)

		expect(object).toEqual(schema)
	})

	it('nested opitons with cycle links', () => {
		const object1: any = {}
		const object2: any = {}
		const object3 = {
			a1: {
				a1: {},
			},
		}

		object1.a = object2
		object2.b = object1
		object3.a1.a1 = object3

		const object2_schema = {
			b: {
				a: {
					b: propertyFn({
						required: false,
					}),
				},
			},
		}

		const object3_schema = {
			a1: {
				a1: {
					a1: {
						value1: Number,
					},
				},
			},
		}

		const fn1 = () => parseFn(object2, object2_schema)
		const fn2 = () => parseFn(object3, object3_schema)

		expect(fn1).toThrow()
		expect(fn2).toThrow()
	})
})
