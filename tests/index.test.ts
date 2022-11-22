import { parseOptions, schemaProperty } from '../dist'

const parseFn = parseOptions

it('Check plugin arguments', () => {
	expect(() => parseFn()).toThrow()
	expect(() => parseFn('hello', ['hello'])).toThrow()
	expect(() => parseFn(null, ['hello'])).toThrow()
	expect(() => parseFn(undefined, ['hello'])).toThrow()
	expect(() => parseFn([], ['hello'])).toThrow()
	expect(() => parseFn([], {})).toThrow()
})

it('Check plugin config', () => {
	const object = {}

	const newObject = parseFn(
		object,
		{ name: schemaProperty({ required: false, default: 'hello' }) },
		{ clone: true }
	)

	expect(object).toEqual({})
	expect(newObject).toEqual({ name: 'hello' })
})
