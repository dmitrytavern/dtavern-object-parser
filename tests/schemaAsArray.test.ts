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

	it('options are nested with cycle links', () => {
		const object1: any = {}
		const object2: any = {}
		const object3 = {
			a1: {
				a1: {},
			},
		}

		object1.a = object2
		object2.b = object1
		object3.a1.a1 = object3

		const object2_schema = ['a.b']
		const object3_schema = ['a1']

		const fn1 = () => parseFn(object2, object2_schema)
		const fn2 = () => parseFn(object3, object3_schema)

		expect(fn1).toThrow()
		expect(fn2).toThrow()
	})
})
