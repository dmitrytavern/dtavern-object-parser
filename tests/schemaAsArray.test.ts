import { parseOptions } from '../dist'

const parseFn = parseOptions

describe('Check schema as array', () => {
	it('properties have equals options', () => {
		const object = parseFn({ name: 'Dmitry' }, ['name'])
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('properties have more options then settings', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, ['name', 'nickname'])
		expect(fn).toThrow()
	})

	it('properties have less options then settings', () => {
		const fn = () => parseFn({ name: 'Dmitry', age: 13 }, ['name'])
		expect(fn).toThrow()
	})
})
