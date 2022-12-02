import { utils } from '../../dist/object-parser'

const compareFn = utils.compareConstructors
const AsyncFunction = utils.AsyncFunction
const GeneratorFunction = utils.GeneratorFunction

class Animal {}
class Bunny extends Animal {}

const jsTypes = [
	/**
	 * Standart types
	*/
	{name: 'undefined', instance: undefined, type: undefined},
  {name: 'null', instance: null, type: null},
  {name: 'boolean true', instance: true, type: Boolean},
  {name: 'boolean false', instance: false, type: Boolean},
  {name: 'number', instance: 42, type: Number},
  {name: 'number NaN', instance: NaN, type: Number},
  {name: 'string', instance: 'str', type: String},
  {name: 'object', instance: {}, type: Object},
  {name: 'array', instance: [1, 2, 3], type: Array},
  {name: 'Object.create', instance: Object.create(null), type: Object},
  {name: 'RegExp from //', instance: /foo/, type: RegExp},
  {name: 'RegExp from class', instance: new RegExp('foo'), type: RegExp},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  {name: 'Function', instance: function() {}, type: Function},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  {name: 'AsyncFunction', instance: async function() {}, type: AsyncFunction},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  {name: 'GeneratorFunction', instance: function * () {}, type: GeneratorFunction},
  {name: 'Date', instance: new Date(), type: Date},
  {name: 'Error', instance: new Error('error'), type: Error},
  {name: 'Symbol', instance: Symbol('str'), type: Symbol},
  {name: 'Map', instance: new Map(), type: Map},
  {name: 'WeekMap', instance: new WeakMap(), type: WeakMap},
  {name: 'Set', instance: new Set(), type: Set},
  {name: 'WeakSet', instance: new WeakSet(), type: WeakSet},
  {name: 'Int8Array', instance: new Int8Array(), type: Int8Array},
  {name: 'Uint8Array', instance: new Uint8Array(), type: Uint8Array},
  {name: 'Uint8ClampedArray', instance: new Uint8ClampedArray(), type: Uint8ClampedArray},
  {name: 'Uint16Array', instance: new Uint16Array(), type: Uint16Array},
  {name: 'Int32Array', instance: new Int32Array(), type: Int32Array},
  {name: 'Uint32Array', instance: new Uint32Array(), type: Uint32Array},
  {name: 'Float32Array', instance: new Float32Array(), type: Float32Array},
  {name: 'Float64Array', instance: new Float64Array(), type: Float64Array},

	/**
	 * Node.js types
	*/
	{name: 'Buffer', instance: new Buffer(''), type: Buffer},
	{name: 'Buffer.from', instance: Buffer.from([1]), type: Buffer},
	{name: 'Buffer.alloc', instance: Buffer.alloc(10), type: Buffer},
	{name: 'Buffer.allocUnsafe', instance: Buffer.allocUnsafe(10), type: Buffer},

	/**
	 * Custom classes
	 */
	{name: 'class Animal', instance: new Animal(), type: Animal},
	{name: 'class Bunny extends Animal', instance: new Bunny(), type: Bunny},
]

it.each(jsTypes)('compare instance and type of $name type', (jsType) => {
	expect(compareFn(jsType.instance, jsType.type)).toBeTruthy()
})

it.each(jsTypes)('compare instance of $name with other types', (jsType) => {
	for (const type of jsTypes) {
		if (jsType.type === type.type) continue

		const result = compareFn(jsType.instance, type.type)
		
		if (result) console.log('Compared: "' + jsType.name + '" with "' + type.name + '"')
		if (result) console.log(jsType.instance)

		expect(result).toBeFalsy()
	}
})
