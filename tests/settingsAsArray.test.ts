import { defineOptions } from '../dist'

describe('Check plugin settings as array', () => {
	it('properties have equals options', () => {
		const object = defineOptions({ name: 'Dmitry' }, ['name'])
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('properties have more options then settings', () => {
		const fn = () => defineOptions({ name: 'Dmitry' }, ['name', 'nickname'])
		expect(fn).toThrow()
	})

	it('properties have less options then settings', () => {
		const fn = () => defineOptions({ name: 'Dmitry', age: 13 }, ['name'])
		expect(fn).toThrow()
	})
})
