import { utils } from '../../dist/object-parser'
import { types } from './types'

const compareFn = utils.compareConstructors

it.each(types)(
	'compare instance and type of "$name" type',
	({ instance, type }) => {
		expect(compareFn(instance, type)).toBeTruthy()
	}
)

it.each(types)(
	'compare instance of "$name" with other types',
	({ type, instance, ignore }) => {
		for (const otherType of types) {
			if (type === otherType.type) continue
			if (ignore.includes(otherType.type)) continue

			expect(compareFn(instance, otherType.type)).toBeFalsy()
		}
	}
)

it('compare null instance with null type in array', () => {
	expect(compareFn(null, [Function, null, String])).toBeTruthy()
})

it('compare undefined instance with undefined type in array', () => {
	expect(compareFn(undefined, [Function, undefined, String])).toBeTruthy()
})

it('compare instance with upcasting types', () => {
	class Animal {}
	class Bunny extends Animal {}
	class WhiteBunny extends Bunny {}

	const whiteBunny = new WhiteBunny()
	const bunny = new Bunny()
	const animal = new Animal()

	expect(compareFn(whiteBunny, WhiteBunny)).toBeTruthy()
	expect(compareFn(whiteBunny, Bunny)).toBeTruthy()
	expect(compareFn(whiteBunny, Animal)).toBeTruthy()

	expect(compareFn(bunny, WhiteBunny)).toBeFalsy()
	expect(compareFn(bunny, Bunny)).toBeTruthy()
	expect(compareFn(bunny, Animal)).toBeTruthy()

	expect(compareFn(animal, WhiteBunny)).toBeFalsy()
	expect(compareFn(animal, Bunny)).toBeFalsy()
	expect(compareFn(animal, Animal)).toBeTruthy()

	expect(compareFn(animal, Object)).toBeTruthy()
})
