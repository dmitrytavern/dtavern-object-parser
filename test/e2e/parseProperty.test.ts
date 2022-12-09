// @ts-nocheck

import { parseProperty } from '../../dist/object-parser.js'

const propertyParseFn = parseProperty

describe('type checking', () => {
	const value = 'Value'
	const objectKey = 'target'
	const object = { [objectKey]: value }

	const arrayKey = 0
	const array = [value]

	it('should not throw when a type is valid', () => {
		const schema = { type: String }

		expect(() => propertyParseFn(object, objectKey, schema)).not.toThrow()
		expect(() => propertyParseFn(array, arrayKey, schema)).not.toThrow()
	})

	it('should throw when a type is not valid', () => {
		const schema = { type: Number }

		expect(() => propertyParseFn(object, objectKey, schema)).toThrow()
		expect(() => propertyParseFn(array, arrayKey, schema)).toThrow()
	})
})

describe('required checking', () => {
	const value = 'Hello'
	const objectKey = 'target'
	const arrayKey = 0

	const schemaTrue = { required: true }
	const schemaFalse = { required: false }

	it('should not throw when an object key exists', () => {
		const object = { [objectKey]: value }
		const array = [value]

		expect(() => propertyParseFn(object, objectKey, schemaTrue)).not.toThrow()
		expect(() => propertyParseFn(object, objectKey, schemaFalse)).not.toThrow()
		expect(() =>
			propertyParseFn(object, {}, objectKey, schemaFalse)
		).not.toThrow()

		expect(() => propertyParseFn(array, arrayKey, schemaTrue)).not.toThrow()
		expect(() => propertyParseFn(array, arrayKey, schemaFalse)).not.toThrow()
		expect(() =>
			propertyParseFn(array, [], arrayKey, schemaFalse)
		).not.toThrow()
	})

	it('should throw when an object key not exists', () => {
		const object = {}
		const array = []

		expect(() => propertyParseFn(object, objectKey, schemaTrue)).toThrow()
		expect(() => propertyParseFn(array, arrayKey, schemaTrue)).toThrow()
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

		expect(() => propertyParseFn(object, objectKey, schema)).not.toThrow()
		expect(() => propertyParseFn(array, arrayKey, schema)).not.toThrow()
	})

	it('should not throw when a validator returns true', () => {
		const validator = () => true
		const schema = { validator }

		expect(() => propertyParseFn(object, objectKey, schema)).not.toThrow()
		expect(() => propertyParseFn(array, arrayKey, schema)).not.toThrow()
	})

	it('should throw when a validator returns false', () => {
		const validator = () => false
		const schema = { validator }

		expect(() => propertyParseFn(object, objectKey, schema)).toThrow()
		expect(() => propertyParseFn(array, arrayKey, schema)).toThrow()
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
