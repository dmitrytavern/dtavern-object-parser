import { parseProperties, createSchemaProperty } from '../dist/object-parser'

const parseFn = parseProperties
const propertyFn = createSchemaProperty

describe('Check option type setting', () => {
	const opt = { name: 'Dmitry' }

	it('type not exists', () => {
		const object = parseFn(opt, { name: propertyFn({}) })
		expect(object).toEqual(opt)
	})

	it('type is correct', () => {
		const object = parseFn(opt, {
			name: propertyFn({ type: String }),
		})
		expect(object).toEqual(opt)
	})

	it('type is wrong', () => {
		const fn = () => parseFn(opt, { name: propertyFn({ type: Number }) })
		expect(fn).toThrow()
	})

	it('type is null', () => {
		const object = parseFn(opt, { name: propertyFn({ type: null }) })
		expect(object).toEqual(opt)
	})

	it('type value is wrong', () => {
		const fn = () => parseFn(opt, { name: propertyFn({ type: 'hello' }) })
		expect(fn).toThrow()
	})

	it('type value is empty array', () => {
		const fn = () => parseFn(opt, { name: propertyFn({ type: [] }) })
		expect(fn).toThrow()
	})

	it('type value is array with wrong values', () => {
		const fn = () =>
			parseFn(opt, {
				name: propertyFn({ type: [Number, 'string', false, undefined] }),
			})
		expect(fn).toThrow()
	})
})

describe('Check option validator setting', () => {
	const opt = { name: 'Dmitry' }
	const setValidator = (checkValue) => {
		return { validator: (value) => value === checkValue }
	}

	it('validator returns true', () => {
		const object = parseFn(opt, {
			name: propertyFn({ ...setValidator('Dmitry') }),
		})

		expect(object).toEqual(opt)
	})

	it('validator returns false', () => {
		const fn1 = () =>
			parseFn(opt, {
				name: propertyFn({ ...setValidator('Other name') }),
			})

		expect(fn1).toThrow()
	})
})

describe('Check option required setting', () => {
	it('required setting is false', () => {
		const object = parseFn({}, { name: propertyFn({ required: false }) })
		expect(object).toEqual({})
	})

	it('required setting is true', () => {
		const fn = () => parseFn({}, { name: propertyFn({ required: true }) })
		expect(fn).toThrow()
	})
})

describe('Check option default setting', () => {
	const settings1 = {
		name: propertyFn({ required: false, default: 'hello world' }),
	}

	it('property does not exist', () => {
		const object = parseFn({}, settings1)
		expect(object).toEqual({ name: 'hello world' })
	})

	it('property does exist', () => {
		const object = parseFn({ name: 'Dmitry' }, settings1)
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('default as funtion', () => {
		const object = parseFn(
			{},
			{
				name: propertyFn({
					type: Object,
					required: false,
					default: () => {
						return { test: true }
					},
				}),
			}
		)
		expect(object).toEqual({ name: { test: true } })
	})

	it('default as function with type error', () => {
		const fn = () =>
			parseFn(
				{},
				{
					name: propertyFn({
						type: Array,
						required: false,
						default: () => {
							return { test: true }
						},
					}),
				}
			)
		expect(fn).toThrow()
	})

	it('default as function with validator error', () => {
		const fn = () =>
			parseFn(
				{},
				{
					name: propertyFn({
						required: false,
						default: () => {
							return { test: true }
						},
						validator: (value: { test: boolean }) => {
							return value.test === false
						},
					}),
				}
			)

		expect(fn).toThrow()
	})

	it('default as no-primitive value', () => {
		const object = parseFn(
			{},
			{
				name: propertyFn({
					required: false,
					default: {
						test: true,
					},
				}),
			}
		)

		expect(object).toEqual({ name: { test: true } })
	})
})

it('Check unknown setting key', () => {
	const fn = () =>
		parseFn(
			{
				name: 'Hello',
			},
			{
				name: propertyFn({
					type: String,
					require: true,
				}),
			}
		)

	expect(fn).toThrow()
})
