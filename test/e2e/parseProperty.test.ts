// @ts-nocheck

import { parser } from '../../dist/object-parser.js'

const propertyParseFn = parser.single
const matchValidatorError = /did not pass the validator/
const matchExsitsError = /not exists/
const matchTypeError = /invalid type/

describe('type checking', () => {
	const value = 'Value'
	const objectKey = 'target'
	const object = { [objectKey]: value }

	const arrayKey = 0
	const array = [value]

	it('should return undefined when a type is valid', () => {
		const schema = { type: String }

		expect(propertyParseFn(object, objectKey, schema)).toBeUndefined()
		expect(propertyParseFn(array, arrayKey, schema)).toBeUndefined()
	})

	it('should return an error when a type is not valid', () => {
		const schema = { type: Number }

		expect(propertyParseFn(object, objectKey, schema).message).toMatch(
			matchTypeError
		)
		expect(propertyParseFn(array, arrayKey, schema).message).toMatch(
			matchTypeError
		)
	})
})

describe('required checking', () => {
	const value = 'Hello'
	const objectKey = 'target'
	const arrayKey = 0

	const schemaTrue = { required: true }
	const schemaFalse = { required: false }

	it('should return undefined when an object key exists', () => {
		const object = { [objectKey]: value }
		const array = [value]

		expect(propertyParseFn(object, objectKey, schemaTrue)).toBeUndefined()
		expect(propertyParseFn(object, objectKey, schemaFalse)).toBeUndefined()
		expect(propertyParseFn(object, {}, objectKey, schemaFalse)).toBeUndefined()

		expect(propertyParseFn(array, arrayKey, schemaTrue)).toBeUndefined()
		expect(propertyParseFn(array, arrayKey, schemaFalse)).toBeUndefined()
		expect(propertyParseFn(array, [], arrayKey, schemaFalse)).toBeUndefined()
	})

	it('should return an error when an object key not exists', () => {
		const object = {}
		const array = []

		expect(propertyParseFn(object, objectKey, schemaTrue).message).toMatch(
			matchExsitsError
		)
		expect(propertyParseFn(array, arrayKey, schemaTrue).message).toMatch(
			matchExsitsError
		)
	})
})

describe('default checking', () => {
	const value = 'Value'
	const defaultValue = 'Default value'
	const objectKey = 'target'
	const arrayKey = 0

	const schema = {
		required: false,
		default: defaultValue,
	}

	it('should keep already exists value', () => {
		const object = { [objectKey]: value }
		const array = [value]

		propertyParseFn(object, objectKey, schema)
		propertyParseFn(array, arrayKey, schema)

		expect(object[objectKey]).toBe(value)
		expect(array[arrayKey]).toBe(value)
	})

	it('should set value when key not exists', () => {
		const object = {}
		const array = []

		propertyParseFn(object, objectKey, schema)
		propertyParseFn(array, arrayKey, schema)

		expect(object[objectKey]).toBe(defaultValue)
		expect(array[arrayKey]).toBe(defaultValue)
	})
})

describe('validator checking', () => {
	const value = 'Hello world'
	const objectKey = 'target'
	const object = { [objectKey]: value }

	const arrayKey = 0
	const array = [value]

	it('should transfer value', () => {
		const validator = (val) => val === value
		const schema = { validator }

		expect(propertyParseFn(object, objectKey, schema)).toBeUndefined()
		expect(propertyParseFn(array, arrayKey, schema)).toBeUndefined()
	})

	it('should return undefined when a validator returns true', () => {
		const validator = () => true
		const schema = { validator }

		expect(propertyParseFn(object, objectKey, schema)).toBeUndefined()
		expect(propertyParseFn(array, arrayKey, schema)).toBeUndefined()
	})

	it('should return an error when a validator returns false', () => {
		const validator = () => false
		const schema = { validator }

		expect(propertyParseFn(object, objectKey, schema).message).toMatch(
			matchValidatorError
		)
		expect(propertyParseFn(array, arrayKey, schema).message).toMatch(
			matchValidatorError
		)
	})

	it('should returns an error when a validator throws', () => {
		const validatorThrowsString = () => {
			throw 'some errors'
		}

		const validatorThrowsError = () => {
			throw new Error('some errors')
		}

		const schema1 = { validator: validatorThrowsString }
		const schema2 = { validator: validatorThrowsError }

		expect(propertyParseFn(object, objectKey, schema1).message).toMatch(
			/some errors/
		)
		expect(propertyParseFn(array, arrayKey, schema1).message).toMatch(
			/some errors/
		)

		expect(propertyParseFn(object, objectKey, schema2).message).toMatch(
			/some errors/
		)
		expect(propertyParseFn(array, arrayKey, schema2).message).toMatch(
			/some errors/
		)
	})
})

describe('object writable', () => {
	const defaultValue = 'Default value'

	it('should set a default value to a writable object', () => {
		const object = {}
		const objectClone = {}
		const objectKey = 'target'

		propertyParseFn(object, objectClone, objectKey, {
			required: false,
			default: defaultValue,
		})

		expect(Object.hasOwn(object, objectKey)).toBeFalsy()
		expect(Object.hasOwn(objectClone, objectKey)).toBeTruthy()
		expect(objectClone[objectKey]).toBe(defaultValue)
	})

	it('should set a default value to a writable array', () => {
		const array = []
		const arrayClone = []
		const arrayKey = 0

		propertyParseFn(array, arrayClone, arrayKey, {
			required: false,
			default: defaultValue,
		})

		expect(Object.hasOwn(array, arrayKey)).toBeFalsy()
		expect(Object.hasOwn(arrayClone, arrayKey)).toBeTruthy()
		expect(arrayClone[arrayKey]).toBe(defaultValue)
	})
})

describe('error handling', () => {
	const objectValue = 'value'
	const objectKey = 'target'
	const object = { [objectKey]: objectValue }

	it('throws when a writable object is not an object', () => {
		expect(() => propertyParseFn(undefined, objectKey, {})).toThrow()
		expect(() => propertyParseFn({}, undefined, objectKey, {})).toThrow()
	})

	it('throws when a schema is not an object', () => {
		expect(() => propertyParseFn(object, objectKey, [])).toThrow()
		expect(() => propertyParseFn(object, objectKey, '')).toThrow()

		expect(() => propertyParseFn(object, object, objectKey, [])).toThrow()
		expect(() => propertyParseFn(object, object, objectKey, '')).toThrow()
	})
})
