import { defineOptions } from '../dist'

describe('Check property types of setting option', () => {
	const opt = { name: 'Dmitry' }

	it('type not found', () => {
		const object = defineOptions(opt, { name: {} })
		expect(object).toEqual(opt)
	})

	it('type is correct', () => {
		const object = defineOptions(opt, { name: { type: String } })
		expect(object).toEqual(opt)
	})

	it('type is wrong', () => {
		const fn = () => defineOptions(opt, { name: { type: Number } })
		expect(fn).toThrow()
	})

	it('type is null', () => {
		const object = defineOptions(opt, { name: { type: null } })
		expect(object).toEqual(opt)
	})

	it('type value is wrong', () => {
		const fn = () => defineOptions(opt, { name: { type: 'hello' } })
		expect(fn).toThrow()
	})

	it('type value is empty array', () => {
		const fn = () => defineOptions(opt, { name: { type: [] } })
		expect(fn).toThrow()
	})

	it('type value is array with wrong values', () => {
		const fn = () =>
			defineOptions(opt, {
				name: { type: [Number, 'string', false, undefined] },
			})
		expect(fn).toThrow()
	})
})

describe('Check property validator of setting option', () => {
	const opt = { name: 'Dmitry' }
	const setValidator = (checkValue) => {
		return { validator: (value) => value === checkValue }
	}

	it('validator returns true', () => {
		const object = defineOptions(opt, {
			name: { ...setValidator('Dmitry') },
		})

		expect(object).toEqual(opt)
	})

	it('validator returns false', () => {
		const fn1 = () =>
			defineOptions(opt, {
				name: { ...setValidator('Other name') },
			})

		expect(fn1).toThrow()
	})
})

describe('Check property required of setting option', () => {
	it('required setting is false', () => {
		const object = defineOptions({}, { name: { required: false } })
		expect(object).toEqual({})
	})

	it('required setting is true', () => {
		const fn = () => defineOptions({}, { name: { required: true } })
		expect(fn).toThrow()
	})
})

describe('Check property default of setting option', () => {
	const settings1 = {
		name: { required: false, default: 'hello world' },
	}

	it('property does not exist', () => {
		const object = defineOptions({}, settings1)
		expect(object).toEqual({ name: 'hello world' })
	})

	it('property does exist', () => {
		const object = defineOptions({ name: 'Dmitry' }, settings1)
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('default as funtion', () => {
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

	it('default as function with type error', () => {
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

	it('default as function with validator error', () => {
		const fn = () =>
			defineOptions(
				{},
				{
					name: {
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

	it('default as no-primitive value', () => {
		const object = defineOptions(
			{},
			{
				name: {
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
