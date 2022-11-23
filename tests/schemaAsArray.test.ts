import { parseOptions } from '../dist'

const parseFn = parseOptions

describe('Check schema as array', () => {
	it('schema have equals options', () => {
		const object = parseFn({ name: 'Dmitry' }, ['name'])
		expect(object).toEqual({ name: 'Dmitry' })
	})

	it('schema have more keys then options', () => {
		const fn = () => parseFn({ name: 'Dmitry' }, ['name', 'nickname'])
		expect(fn).toThrow()
	})

	it('schema have less keys then options', () => {
		const fn = () => parseFn({ name: 'Dmitry', age: 13 }, ['name'])
		expect(fn).toThrow()
	})

	it('schema have some parser functions', () => {
		const schema = ['name', 'age']
		const object1 = { name: 'Dmitry', age: 20 }
		const object2 = { name: 'Elly', age: 19 }

		parseFn(object1, schema)
		parseFn(object2, schema)
		expect(schema).toEqual(['name', 'age'])
	})

	it('options are nested', () => {
		const object = parseFn({ name: { first: '' } }, ['name.first'])
		expect(object).toEqual({ name: { first: '' } })
	})

	it('options are nested with full path', () => {
		const object = parseFn({ name: { first: { first: { nothing: '' } } } }, [
			'name',
			'name.first',
			'name.first.first',
			'name.first.first.nothing',
		])

		expect(object).toEqual({ name: { first: { first: { nothing: '' } } } })
	})

	it('options are nested with error', () => {
		const fn = () =>
			parseFn({ name: { first: '' } }, ['name', 'name.first', 'name.last'])
		expect(fn).toThrow()
	})
})
