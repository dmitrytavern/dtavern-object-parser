import { parseOptions, schemaProperty } from '../dist'

const parseFn = parseOptions

describe('Check option type setting', () => {
	const opt = { name: 'Dmitry' }

	it('type not exists', () => {
		const object = parseFn(opt, { name: schemaProperty({}) })
		expect(object).toEqual(opt)
	})

	it('type is correct', () => {
		const object = parseFn(opt, {
			name: schemaProperty({ type: String }),
		})
		expect(object).toEqual(opt)
	})

	it('type is wrong', () => {
		const fn = () => parseFn(opt, { name: schemaProperty({ type: Number }) })
		expect(fn).toThrow()
	})

	it('type is null', () => {
		const object = parseFn(opt, { name: schemaProperty({ type: null }) })
		expect(object).toEqual(opt)
	})

	it('type value is wrong', () => {
		const fn = () => parseFn(opt, { name: schemaProperty({ type: 'hello' }) })
		expect(fn).toThrow()
	})

	it('type value is empty array', () => {
		const fn = () => parseFn(opt, { name: schemaProperty({ type: [] }) })
		expect(fn).toThrow()
	})

	it('type value is array with wrong values', () => {
		const fn = () =>
			parseFn(opt, {
				name: schemaProperty({ type: [Number, 'string', false, undefined] }),
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
			name: schemaProperty({ ...setValidator('Dmitry') }),
		})

		expect(object).toEqual(opt)
	})

	it('validator returns false', () => {
		const fn1 = () =>
			parseFn(opt, {
				name: schemaProperty({ ...setValidator('Other name') }),
			})

		expect(fn1).toThrow()
	})
})

describe('Check option required setting', () => {
	it('required setting is false', () => {
		const object = parseFn({}, { name: schemaProperty({ required: false }) })
		expect(object).toEqual({})
	})

	it('required setting is true', () => {
		const fn = () => parseFn({}, { name: schemaProperty({ required: true }) })
		expect(fn).toThrow()
	})
})

describe('Check option default setting', () => {
	const settings1 = {
		name: schemaProperty({ required: false, default: 'hello world' }),
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
				name: schemaProperty({
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
					name: schemaProperty({
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
					name: schemaProperty({
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
				name: schemaProperty({
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
				name: schemaProperty({
					type: String,
					require: true,
				}),
			}
		)

	expect(fn).toThrow()
})
