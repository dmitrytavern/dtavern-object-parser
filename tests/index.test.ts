import { defineOptions } from '../dist'

it('Function properties exists', () => {
	expect(() => defineOptions()).toThrow()
	expect(() => defineOptions('hello', ['hello'])).toThrow()
	expect(() => defineOptions(null, ['hello'])).toThrow()
})

describe('Check settings as array', () => {
	it('If properties have equals items', () => {
		expect(() => defineOptions({ name: 'Dmitry' }, ['name'])).not.toThrow()
	})

	it('If properties have more items then settings', () => {
		expect(() =>
			defineOptions({ name: 'Dmitry' }, ['name', 'nickname'])
		).toThrow()
	})

	it('If properties have less items then settings', () => {
		expect(() =>
			defineOptions({ name: 'Dmitry', nickname: 'dmitrytavern' }, ['name'])
		).toThrow()
	})
})

describe('Check settings as object', () => {
	it('If properties is correct', () => {
		expect(() =>
			defineOptions(
				{
					name: 'Dmitry',
					age: 13,
					root: false,
					symbol: Symbol('test'),
					bigint: BigInt(9007199254740991),
				},
				{
					name: String,
					age: Number,
					root: Boolean,
					symbol: Symbol,
					bigint: BigInt,
				}
			)
		).not.toThrow()
	})

	it('If properties is not correct', () => {
		expect(() => defineOptions({ name: 'Dmitry' }, { name: Number })).toThrow()
	})

	it('If properties have some types', () => {
		expect(() =>
			defineOptions({ age: 13 }, { age: [Number, String] })
		).not.toThrow()
	})

	it('If properties have any type', () => {
		expect(() =>
			defineOptions({ anyType: undefined }, { anyType: null })
		).not.toThrow()
	})
})

describe('Check property settings as object', () => {
	const opt = { name: 'Dmitry' }

	it('Object have only type', () => {
		expect(() => defineOptions(opt, { name: { type: String } })).not.toThrow()
		expect(() => defineOptions(opt, { name: { type: Number } })).toThrow()
	})

	it('Object have validator', () => {
		expect(() =>
			defineOptions(opt, {
				name: {
					type: String,
					validator: (value) => value === 'Dmitry',
				},
			})
		).not.toThrow()

		expect(() =>
			defineOptions(opt, {
				name: {
					type: String,
					validator: (value) => value === 'Other name',
				},
			})
		).toThrow()
	})

	it('Object have required', () => {
		expect(() =>
			defineOptions(
				{},
				{
					name: {
						type: String,
						required: false,
					},
				}
			)
		).not.toThrow()
	})

	it('Object have default', () => {
		expect(
			defineOptions(
				{},
				{
					name: {
						type: String,
						default: 'hello world',
						required: false,
					},
				}
			)
		).toEqual({ name: 'hello world' })

		expect(
			defineOptions(
				{ name: 'Dmitry' },
				{
					name: {
						type: String,
						default: 'hello world',
						required: false,
					},
				}
			)
		).toEqual({ name: 'Dmitry' })
	})

	it('Object have default as funtion', () => {
		expect(
			defineOptions(
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
		).toEqual({ name: { test: true } })
	})
})
