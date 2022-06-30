import { defineOptions } from '../dist'

it('Default test', () => {
	expect(() => defineOptions()).toThrow()
})
