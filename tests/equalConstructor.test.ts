import { isEqualConstructor } from '../src/isEqualConstructor'

describe('Check primitive constructors', () => {
	it('Check string constructor', () => {
		expect(isEqualConstructor('', String)).toBeTruthy()
		expect(isEqualConstructor('hello world', String)).toBeTruthy()
		expect(isEqualConstructor('123', String)).toBeTruthy()

		expect(isEqualConstructor(134, String)).toBeFalsy()
		expect(isEqualConstructor(false, String)).toBeFalsy()
		expect(isEqualConstructor(Symbol('text'), String)).toBeFalsy()
	})

	it('Check number constructor', () => {
		expect(isEqualConstructor(123, Number)).toBeTruthy()
		expect(isEqualConstructor(NaN, Number)).toBeTruthy()
		expect(isEqualConstructor(1324e3, Number)).toBeTruthy()

		expect(isEqualConstructor('134', Number)).toBeFalsy()
	})

	it('Check boolean constructor', () => {
		expect(isEqualConstructor(true, Boolean)).toBeTruthy()
		expect(isEqualConstructor(false, Boolean)).toBeTruthy()

		expect(isEqualConstructor('', Boolean)).toBeFalsy()
		expect(isEqualConstructor(0, Boolean)).toBeFalsy()
		expect(isEqualConstructor(null, Boolean)).toBeFalsy()
		expect(isEqualConstructor(undefined, Boolean)).toBeFalsy()
	})

	it('Check symbol constructor', () => {
		expect(isEqualConstructor(Symbol('test'), Symbol)).toBeTruthy()

		expect(isEqualConstructor('Symbol', Symbol)).toBeFalsy()
	})
})

describe('Check not primitive constructors', () => {
	it('Check array constructor', () => {
		expect(isEqualConstructor([], Array)).toBeTruthy()
		expect(isEqualConstructor({}, Array)).toBeFalsy()
	})

	it('Check object constructor', () => {
		expect(isEqualConstructor({}, Object)).toBeTruthy()
		expect(isEqualConstructor([], Object)).toBeFalsy()
	})

	it('Check function constructor', () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(isEqualConstructor(() => {}, Function)).toBeTruthy()

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(isEqualConstructor(function () {}, Function)).toBeTruthy()

		expect(isEqualConstructor(class Animal {}, Function)).toBeTruthy()
	})
})

describe('Check custom constructors', () => {
	class Animal {}
	const animal = new Animal()

	expect(isEqualConstructor(animal, Animal)).toBeTruthy()
	expect(isEqualConstructor('animal', Animal)).toBeFalsy()
})
