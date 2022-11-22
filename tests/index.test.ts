import { parseOptions } from '../dist'

const parseFn = parseOptions

it('Check plugin arguments', () => {
	expect(() => parseFn()).toThrow()
	expect(() => parseFn('hello', ['hello'])).toThrow()
	expect(() => parseFn(null, ['hello'])).toThrow()
	expect(() => parseFn(undefined, ['hello'])).toThrow()
	expect(() => parseFn([], ['hello'])).toThrow()
	expect(() => parseFn([], {})).toThrow()
})
