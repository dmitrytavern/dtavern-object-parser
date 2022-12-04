import {
	isSchemaProperty,
	createSchema,
	createSchemaProperty,
} from '../../dist/object-parser'

const schemaFn = createSchema
const propertyFn = createSchemaProperty
const isPropertyFn = isSchemaProperty

it('is schema property', () => {
	const settings = propertyFn({})

	expect(isPropertyFn(settings)).toBeTruthy()
})

it('empty raw settings', () => {
	const settings = propertyFn({})

	expect(settings).toEqual({
		type: null,
		typeElement: null,
		required: true,
		default: null,
		validator: null,
	})
})

describe('setting type', () => {
	it('type is correct', () => {
		const settings = propertyFn({ type: String })

		expect(settings).toEqual({
			type: String,
			typeElement: null,
			required: true,
			default: null,
			validator: null,
		})
	})

	it('type is not correct', () => {
		expect(() => propertyFn({ type: false })).toThrow()
		expect(() => propertyFn({ type: [false, 'sdf'] })).toThrow()
	})
})

it('setting reqired', () => {
	const settings = propertyFn({ required: false })

	expect(settings).toEqual({
		type: null,
		typeElement: null,
		required: false,
		default: null,
		validator: null,
	})
})

it('setting default', () => {
	const settings = propertyFn({ required: false, default: 'def' })

	expect(settings).toEqual({
		type: null,
		typeElement: null,
		required: false,
		default: 'def',
		validator: null,
	})
})

describe('setting validator', () => {
	it('validator is correct', () => {
		const fn = () => true
		const settings = propertyFn({ validator: fn })

		expect(settings).toEqual({
			type: null,
			typeElement: null,
			required: true,
			default: null,
			validator: fn,
		})
	})

	it('validator is not correct', () => {
		expect(() => propertyFn({ validator: false })).toThrow()
		expect(() => propertyFn({ validator: 'sdfsd' })).toThrow()
	})
})

describe('setting type element', () => {
	const defaults = {
		required: true,
		default: null,
		validator: null,
	}

	it('type element is null', () => {
		const settings = propertyFn({ type: Array, typeElement: null })

		expect(settings).toEqual({
			...defaults,
			type: Array,
			typeElement: {
				...defaults,
				type: null,
				typeElement: null,
			},
		})
	})

	it('type element is correct', () => {
		const settings = propertyFn({ type: Array, typeElement: Number })

		expect(settings).toEqual({
			...defaults,
			type: Array,
			typeElement: {
				...defaults,
				type: Number,
				typeElement: null,
			},
		})
	})

	it('type element is schema', () => {
		const settings = propertyFn({
			type: Array,
			typeElement: propertyFn({ type: [String, Boolean] }),
		})

		expect(settings).toEqual({
			...defaults,
			type: Array,
			typeElement: {
				...defaults,
				type: [String, Boolean],
				typeElement: null,
			},
		})
	})

	it('type element is property schema', () => {
		const settings = propertyFn({
			type: Array,
			typeElement: schemaFn({ a: { b: [String, Number] } }),
		})

		expect(settings).toEqual({
			...defaults,
			type: Array,
			typeElement: {
				a: {
					b: {
						...defaults,
						type: [String, Number],
						typeElement: null,
					},
				},
			},
		})
	})

	it('type is array but type element is object', () => {
		expect(() => propertyFn({ type: Array, typeElement: {} })).toThrow()
		expect(() =>
			propertyFn({ type: Array, typeElement: { a: { b: String } } })
		).toThrow()
	})

	it('type is not array but type element exists', () => {
		expect(() => propertyFn({ type: Number, typeElement: Number })).toThrow()
	})
})

it('check settings immutable', () => {
	const settings = propertyFn({})

	expect(() => {
		settings.type = String
	}).toThrow()
	expect(() => {
		settings['type'] = String
	}).toThrow()
	expect(() => {
		delete settings['type']
	}).toThrow()
	expect(() => {
		Object.defineProperty(settings, 'type', { value: String })
	}).toThrow()
})

it('check array type setting immutable', () => {
	const settings = propertyFn({ type: [String, Number] })

	expect(settings.type[0]).toBe(String)
	expect(settings.type[2]).toBe(undefined)
	expect(() => {
		settings.type[0] = Boolean
	}).toThrow()
	expect(() => {
		settings.type[2] = Function
	}).toThrow()
	expect(() => {
		settings.type.push(Object)
	}).toThrow()
	expect(() => {
		settings.type.pop()
	}).toThrow()
	expect(() => {
		Object.defineProperty(settings.type, 3, { value: Symbol })
	}).toThrow()
})
