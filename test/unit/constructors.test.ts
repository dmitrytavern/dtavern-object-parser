// @ts-nocheck

import { utils } from '../../dist/object-parser'
import { types } from './types'

const compareFn = utils.compareConstructors
const getterFn = utils.getConstructors
const getConstructorsFn = utils.getConstructors
const isConstructorsFn = utils.isConstructors
const isPrimitveFn = utils.isPrimitiveConstructors
const containsArrayFn = utils.containsArrayConstructor

describe('compare types', () => {
	it.each(types)(
		'compare instance constructors with own "$name" type',
		({ instance, type }) => {
			expect(compareFn(getterFn(instance), type)).toBeTruthy()
		}
	)

	it.each(types)(
		'compare instance constructors of "$name" with other types',
		({ type, instance, ignore }) => {
			for (const otherType of types) {
				if (type === otherType.type) continue
				if (ignore.includes(otherType.type)) continue

				expect(compareFn(getterFn(instance), [otherType.type])).toBeFalsy()
			}
		}
	)
})

describe('type upcasting', () => {
	class Animal {}
	class Bunny extends Animal {}
	class WhiteBunny extends Bunny {}

	const whiteBunny = new WhiteBunny()
	const bunny = new Bunny()
	const animal = new Animal()

	it('should return true for all hierarchy', () => {
		expect(compareFn(getterFn(whiteBunny), WhiteBunny)).toBeTruthy()
		expect(compareFn(getterFn(whiteBunny), Bunny)).toBeTruthy()
		expect(compareFn(getterFn(whiteBunny), Animal)).toBeTruthy()

		expect(compareFn(getterFn(bunny), WhiteBunny)).toBeFalsy()
		expect(compareFn(getterFn(bunny), Bunny)).toBeTruthy()
		expect(compareFn(getterFn(bunny), Animal)).toBeTruthy()

		expect(compareFn(getterFn(animal), WhiteBunny)).toBeFalsy()
		expect(compareFn(getterFn(animal), Bunny)).toBeFalsy()
		expect(compareFn(getterFn(animal), Animal)).toBeTruthy()

		expect(compareFn(getterFn(animal), Object)).toBeTruthy()
	})
})

describe('compareConstructors', () => {
	it('should ignore no-function type', () => {
		expect(compareFn([null], [Function, null, String])).toBeFalsy()
		expect(compareFn([undefined], [Function, undefined, String])).toBeFalsy()
		expect(compareFn(['dfs'], [Function, 'dfs', String])).toBeFalsy()
		expect(compareFn([{}], [Function, {}, String])).toBeFalsy()
		expect(compareFn([[]], [Function, [], String])).toBeFalsy()
	})
})

describe('getConstructors', () => {
	it('should return the object prototype hierarchy', () => {
		expect(getConstructorsFn(null)).toStrictEqual([])
		expect(getConstructorsFn(true)).toStrictEqual([Boolean, Object])
		expect(getConstructorsFn({})).toStrictEqual([Object])
		expect(getConstructorsFn([])).toStrictEqual([Array, Object])
		expect(getConstructorsFn(() => {})).toStrictEqual([Function, Object])
	})
})

describe('isConstructors', () => {
	it('should return true', () => {
		expect(isConstructorsFn(String)).toBeTruthy()
		expect(isConstructorsFn([Number, String])).toBeTruthy()
		expect(
			isConstructorsFn([String, Number, Boolean, BigInt, Symbol])
		).toBeTruthy()
	})

	it('should return false', () => {
		expect(isConstructorsFn(null)).toBeFalsy()
		expect(isConstructorsFn(undefined)).toBeFalsy()
		expect(isConstructorsFn([])).toBeFalsy()
		expect(isConstructorsFn([null, String])).toBeFalsy()
		expect(isConstructorsFn(['sfsdf', String])).toBeFalsy()
	})
})

describe('isPrimitiveConstructors', () => {
	it('should return true', () => {
		expect(isPrimitveFn(String)).toBeTruthy()
		expect(isPrimitveFn([Number, String])).toBeTruthy()
		expect(isPrimitveFn([String, Number, Boolean, BigInt, Symbol])).toBeTruthy()
	})

	it('should return false', () => {
		expect(isPrimitveFn(null)).toBeFalsy()
		expect(isPrimitveFn(undefined)).toBeFalsy()
		expect(isPrimitveFn(Object)).toBeFalsy()
		expect(isPrimitveFn(Function)).toBeFalsy()
		expect(isPrimitveFn([])).toBeFalsy()
		expect(isPrimitveFn([String, Object])).toBeFalsy()
		expect(isPrimitveFn('sdfs')).toBeFalsy()
	})
})

describe('containsArrayConstructor', () => {
	it('should return true', () => {
		expect(containsArrayFn(Array)).toBeTruthy()
		expect(containsArrayFn([Array, String])).toBeTruthy()
	})

	it('should return false', () => {
		expect(containsArrayFn(Object)).toBeFalsy()
		expect(containsArrayFn([])).toBeFalsy()
		expect(containsArrayFn([String, Object])).toBeFalsy()
	})
})
