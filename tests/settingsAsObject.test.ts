import { defineOptions } from '../dist'

describe('Check plugin settings as object', () => {
	it('settings types is correct', () => {
		const object = defineOptions(
			{
				name: 'Dmitry',
				age: 13,
				root: false,
			},
			{
				name: String,
				age: Number,
				root: Boolean,
			}
		)

		expect(object).toEqual({
			name: 'Dmitry',
			age: 13,
			root: false,
		})
	})

	it('settings types is wrong', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, { name: Number })
		expect(fn).toThrow()
	})

	it('settings for properties not found', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, {})
		expect(fn).toThrow()
	})

	it('setting have some types as array', () => {
		const object = defineOptions({ age: 13 }, { age: [Number, String] })
		expect(object).toEqual({ age: 13 })
	})

	it('setting have any type', () => {
		const object = defineOptions({ anyType: undefined }, { anyType: null })
		expect(object).toEqual({ anyType: undefined })
	})

	it('setting have undefined type', () => {
		const fn = () =>
			defineOptions({ anyType: undefined }, { anyType: undefined })
		expect(fn).toThrow()
	})

	it('setting have any type without property', () => {
		const fn = () => defineOptions({}, { anyType: null })
		expect(fn).toThrow()
	})
})
