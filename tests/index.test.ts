import { parseOptions, schemaProperty } from '../dist'

const parseFn = parseOptions
const propertyFn = schemaProperty

it('Check plugin arguments', () => {
	expect(() => parseFn()).toThrow()
	expect(() => parseFn('hello', ['hello'])).toThrow()
	expect(() => parseFn(null, ['hello'])).toThrow()
	expect(() => parseFn(undefined, ['hello'])).toThrow()
	expect(() => parseFn([], ['hello'])).toThrow()
	expect(() => parseFn([], {})).toThrow()
})

describe('Check clone config', () => {
	it('input options have not some properties in copied options', () => {
		const object_input = { name: 'Dmitry' }
		const object_output = parseFn(
			object_input,
			{
				name: String,
				contacts: propertyFn({
					required: false,
					default: () => ({ github: 'https://' }),
				}),
			},
			{
				clone: true,
			}
		)

		expect(object_input).toEqual({ name: 'Dmitry' })
		expect(object_output).toEqual({
			contacts: { github: 'https://' },
			name: 'Dmitry',
		})
	})

	it('clone does not interfere with the keys checker', () => {
		const fn = () =>
			parseFn(
				{ name: 'Dmitry' },
				{
					contacts: propertyFn({
						required: false,
						default: () => ({ github: 'https://' }),
					}),
				},
				{
					clone: true,
				}
			)

		expect(fn).toThrow()
	})
})
