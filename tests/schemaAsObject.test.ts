import { parseOptions, schemaProperty } from '../dist'

const parseFn = parseOptions
const propertyFn = schemaProperty

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

	it('nested schema with not required options and options object have not keys', () => {
		const object = parseFn(
			{},
			{
				contacts: {
					email: {
						name: propertyFn({ required: false }),
						domain: propertyFn({ required: false }),
					},
					twitter: propertyFn({ required: false }),
				},
			}
		)

		expect(object).toEqual({})
	})
})
