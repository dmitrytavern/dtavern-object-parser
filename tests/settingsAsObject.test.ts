import { parseOptions } from '../dist'

const parseFn = parseOptions

describe('Check plugin settings as object', () => {
	it('settings types is correct', () => {
		const object = parseFn(
			{
				name: 'Dmitry',
				age: 13,
				root: false,
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
				age: Number,
				root: Boolean,
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
			age: 13,
			root: false,
			contacts: {
				email: {
					name: 'helloworld',
					domain: 'gmail.com',
				},
				twitter: false,
			},
		})
	})

	it('settings types is wrong', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, { name: Number })
		expect(fn).toThrow()
	})

	it('settings for properties not found', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, {})
		expect(fn).toThrow()
	})

	it('setting have some types as array', () => {
		const object = parseFn({ age: 13 }, { age: [Number, String] })
		expect(object).toEqual({ age: 13 })
	})

	it('setting have any type', () => {
		const object = parseFn({ anyType: undefined }, { anyType: null })
		expect(object).toEqual({ anyType: undefined })
	})

	it('setting have undefined type', () => {
		const fn = () => parseFn({ anyType: undefined }, { anyType: undefined })
		expect(fn).toThrow()
	})

	it('setting have any type without property', () => {
		const fn = () => parseFn({}, { anyType: null })
		expect(fn).toThrow()
	})
})
