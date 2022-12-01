import { parseProperties } from '../dist/object-parser'

const parseFn = parseProperties

describe('Check schema as array', () => {
	it('schema is empty', () => {
		const object = parseFn({}, [])
		expect(object).toEqual({})
	})

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

		object1.a = object2
		object2.b = object1

		const fn1 = () => parseFn(object2, ['a.b'])

		expect(fn1).toThrow()
	})
})
