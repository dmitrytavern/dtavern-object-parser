import { defineOptions } from '../dist'

it('Check plugin arguments', () => {
	expect(() => defineOptions()).toThrow()
	expect(() => defineOptions('hello', ['hello'])).toThrow()
	expect(() => defineOptions(null, ['hello'])).toThrow()
	expect(() => defineOptions(undefined, ['hello'])).toThrow()
	expect(() => defineOptions([], ['hello'])).toThrow()
	expect(() => defineOptions([], {})).toThrow()
})
