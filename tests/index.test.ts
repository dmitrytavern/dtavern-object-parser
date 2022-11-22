import { defineOptions, schemaProperty } from '../dist'

it('Check plugin arguments', () => {
	expect(() => defineOptions()).toThrow()
	expect(() => defineOptions('hello', ['hello'])).toThrow()
	expect(() => defineOptions(null, ['hello'])).toThrow()
	expect(() => defineOptions(undefined, ['hello'])).toThrow()
	expect(() => defineOptions([], ['hello'])).toThrow()
	expect(() => defineOptions([], {})).toThrow()
})

it('Check plugin config', () => {
	const object = {}

	const newObject = defineOptions(
		object,
		{ name: schemaProperty({ required: false, default: 'hello' }) },
		{ clone: true }
	)

	expect(object).toEqual({})
	expect(newObject).toEqual({ name: 'hello' })
})
