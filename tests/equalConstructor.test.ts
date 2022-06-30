import { isEqualConstructor } from '../src/isEqualConstructor'

describe('Check primitive constructors', () => {
	it('Check string proto', () => {
		expect(isEqualConstructor('', String)).toBeTruthy()
		expect(isEqualConstructor('hello world', String)).toBeTruthy()
		expect(isEqualConstructor('123', String)).toBeTruthy()

		expect(isEqualConstructor(134, String)).toBeFalsy()
		expect(isEqualConstructor(false, String)).toBeFalsy()
		expect(isEqualConstructor(Symbol('text'), String)).toBeFalsy()
	})

	it('Check number proto', () => {
		expect(isEqualConstructor(123, Number)).toBeTruthy()

		expect(isEqualConstructor('134', Number)).toBeFalsy()
	})

	it('Check boolean proto', () => {
		expect(isEqualConstructor(true, Boolean)).toBeTruthy()
		expect(isEqualConstructor(false, Boolean)).toBeTruthy()

		expect(isEqualConstructor('', Boolean)).toBeFalsy()
		expect(isEqualConstructor(0, Boolean)).toBeFalsy()
		expect(isEqualConstructor(null, Boolean)).toBeFalsy()
		expect(isEqualConstructor(undefined, Boolean)).toBeFalsy()
	})

	it('Check symbol proto', () => {
		expect(isEqualConstructor(Symbol('test'), Symbol)).toBeTruthy()

		expect(isEqualConstructor('Symbol', Symbol)).toBeFalsy()
	})
})

describe('Check custom constructors', () => {
	class Animal {}
	const animal = new Animal()

	expect(isEqualConstructor(animal, Animal)).toBeTruthy()
	expect(isEqualConstructor('animal', Animal)).toBeFalsy()
})
