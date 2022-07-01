import { defineOptions } from '../dist'

it('Function properties exists', () => {
	expect(() => defineOptions()).toThrow()
	expect(() => defineOptions('hello', ['hello'])).toThrow()
	expect(() => defineOptions(null, ['hello'])).toThrow()
	expect(() => defineOptions(undefined, ['hello'])).toThrow()
	expect(() => defineOptions([], ['hello'])).toThrow()
	expect(() => defineOptions([], {})).toThrow()
})

describe('Plugin settings as array', () => {
	it('properties have equals options', () => {
		const object = defineOptions({ name: 'Dmitry' }, ['name'])
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('properties have more options then settings', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, ['name', 'nickname'])
		expect(fn).toThrow()
	})

	it('properties have less options then settings', () => {
		const fn = () => defineOptions({ name: 'Dmitry', age: 13 }, ['name'])
		expect(fn).toThrow()
	})
})

describe('Plugin settings as object', () => {
	it('properties types is correct', () => {
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

	it('property types is not correct', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, { name: Number })
		expect(fn).toThrow()
	})

	it('property have no settings', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, {})
		expect(fn).toThrow()
	})

	it('property have some types as array', () => {
		const object = defineOptions({ age: 13 }, { age: [Number, String] })
		expect(object).toEqual({ age: 13 })
	})

	it('property have any type', () => {
		const object = defineOptions({ anyType: undefined }, { anyType: null })
		expect(object).toEqual({ anyType: undefined })
	})
})

describe('Plugin property settings as object', () => {
	const opt = { name: 'Dmitry' }
	const setValidator = (checkValue) => {
		return { validator: (value) => value === checkValue }
	}

	it('property setting have only type', () => {
		expect(() => defineOptions(opt, { name: { type: String } })).not.toThrow()
		expect(() => defineOptions(opt, { name: { type: Number } })).toThrow()
	})

	it('property setting have validator', () => {
		const object = defineOptions(opt, {
			name: { type: String, ...setValidator('Dmitry') },
		})

		const fn2 = () =>
			defineOptions(opt, {
				name: { type: String, ...setValidator('Other name') },
			})

		expect(object).toEqual(opt)
		expect(fn2).toThrow()
	})

	it('property setting have required setting', () => {
		const object = defineOptions(
			{},
			{ name: { type: String, required: false } }
		)

		const fn = () =>
			defineOptions({}, { name: { type: String, required: true } })

		expect(object).toEqual({})
		expect(fn).toThrow()
	})

	it('property setting have default setting', () => {
		const settings = {
			name: { type: String, default: 'hello world', required: false },
		}

		const object1 = defineOptions({}, settings)
		const object2 = defineOptions({ name: 'Dmitry' }, settings)

		expect(object1).toEqual({ name: 'hello world' })
		expect(object2).toEqual({ name: 'Dmitry' })
	})

	it('property setting have default setting as funtion', () => {
		const object = defineOptions(
			{},
			{
				name: {
					type: Object,
					required: false,
					default: () => {
						return { test: true }
					},
				},
			}
		)

		expect(object).toEqual({ name: { test: true } })
	})

	it('property setting have default setting with type error', () => {
		const fn = () =>
			defineOptions(
				{},
				{
					name: {
						type: Array,
						required: false,
						default: () => {
							return { test: true }
						},
					},
				}
			)

		expect(fn).toThrow()
	})

	it('property setting have default setting with validator error', () => {
		const fn = () =>
			defineOptions(
				{},
				{
					name: {
						type: Object,
						required: false,
						default: () => {
							return { test: true }
						},
						validator: (value: { test: boolean }) => {
							return value.test === false
						},
					},
				}
			)

		expect(fn).toThrow()
	})

	it('property setting have not primitive default setting', () => {
		const object = defineOptions(
			{},
			{
				name: {
					type: Object,
					required: false,
					default: {
						test: true,
					},
				},
			}
		)

		expect(object).toEqual({ name: { test: true } })
	})
})
