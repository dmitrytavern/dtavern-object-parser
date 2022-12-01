import { utils } from '../dist/index'

const compareFn = utils.compareConstructors
const AsyncFunction = utils.AsyncFunction

describe('Check primitive constructors', () => {
	it('Check string constructor', () => {
		expect(compareFn('', String)).toBeTruthy()
		expect(compareFn('hello world', String)).toBeTruthy()
		expect(compareFn('123', String)).toBeTruthy()

		expect(compareFn(134, String)).toBeFalsy()
		expect(compareFn(false, String)).toBeFalsy()
		expect(compareFn(Symbol('text'), String)).toBeFalsy()
	})

	it('Check number constructor', () => {
		expect(compareFn(123, Number)).toBeTruthy()
		expect(compareFn(NaN, Number)).toBeTruthy()
		expect(compareFn(1324e3, Number)).toBeTruthy()

		expect(compareFn('134', Number)).toBeFalsy()
	})

	it('Check boolean constructor', () => {
		expect(compareFn(true, Boolean)).toBeTruthy()
		expect(compareFn(false, Boolean)).toBeTruthy()

		expect(compareFn('', Boolean)).toBeFalsy()
		expect(compareFn(0, Boolean)).toBeFalsy()
		expect(compareFn(null, Boolean)).toBeFalsy()
		expect(compareFn(undefined, Boolean)).toBeFalsy()
	})

	it('Check symbol constructor', () => {
		expect(compareFn(Symbol('test'), Symbol)).toBeTruthy()

		expect(compareFn('Symbol', Symbol)).toBeFalsy()
	})
})

describe('Check not primitive constructors', () => {
	it('Check array constructor', () => {
		expect(compareFn([], Array)).toBeTruthy()
		expect(compareFn({}, Array)).toBeFalsy()
	})

	it('Check object constructor', () => {
		expect(compareFn({}, Object)).toBeTruthy()
		expect(compareFn([], Object)).toBeFalsy()
	})

	it('Check function constructor', () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(compareFn(() => {}, Function)).toBeTruthy()

		expect(
			compareFn(new Function(`return async () => {}`)(), Function)
		).toBeFalsy()
		expect(
			compareFn(new Function(`return async () => {}`)(), AsyncFunction)
		).toBeTruthy()

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(compareFn(function () {}, Function)).toBeTruthy()

		expect(
			compareFn(new Function(`return async function () {}`)(), Function)
		).toBeFalsy()
		expect(
			compareFn(new Function(`return async function () {}`)(), AsyncFunction)
		).toBeTruthy()

		expect(compareFn(class Animal {}, Function)).toBeTruthy()
	})
})

describe('Check custom constructors', () => {
	class Animal {}
	const animal = new Animal()

	expect(compareFn(animal, Animal)).toBeTruthy()
	expect(compareFn('animal', Animal)).toBeFalsy()
})
