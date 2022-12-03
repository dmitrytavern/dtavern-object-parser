import { utils } from '../../dist/object-parser.js'

const AsyncFunction = utils.AsyncFunction
const GeneratorFunction = utils.GeneratorFunction

class Animal {}

const ignore = [Object]

const primitiveTypes = [
	{ name: 'undefined', instance: undefined, type: undefined, ignore: [] },
	{ name: 'null', instance: null, type: null, ignore: [] },
	{ name: 'string', instance: 'str', type: String, ignore },
	{ name: 'number', instance: 42, type: Number, ignore },
	{ name: 'number NaN', instance: NaN, type: Number, ignore },
	{ name: 'boolean true', instance: true, type: Boolean, ignore },
	{ name: 'boolean false', instance: false, type: Boolean, ignore },
	{ name: 'Symbol', instance: Symbol('str'), type: Symbol, ignore },
]

const functionTypes = [
	{
		name: 'Function',
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		instance: function () {},
		type: Function,
		ignore,
	},
	{
		name: 'AsyncFunction',
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		instance: async function () {},
		type: AsyncFunction,
		ignore: [...ignore, Function],
	},
	{
		name: 'GeneratorFunction',
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		instance: function* () {},
		type: GeneratorFunction,
		ignore: [...ignore, Function],
	},
]

const arrayTypes = [
	{
		name: 'Array',
		instance: [1, 2, 3],
		type: Array,
		ignore,
	},
]

const regexpTypes = [
	{
		name: 'RegExp from //',
		instance: /foo/,
		type: RegExp,
		ignore,
	},
	{
		name: 'RegExp from class',
		instance: new RegExp('foo'),
		type: RegExp,
		ignore,
	},
]

const collectionTypes = [
	{
		name: 'Map',
		instance: new Map(),
		type: Map,
		ignore,
	},
	{
		name: 'WeekMap',
		instance: new WeakMap(),
		type: WeakMap,
		ignore,
	},
	{
		name: 'Set',
		instance: new Set(),
		type: Set,
		ignore,
	},
	{
		name: 'WeakSet',
		instance: new WeakSet(),
		type: WeakSet,
		ignore,
	},
]

const typedArrayTypes = [
	{
		name: 'Int8Array',
		instance: new Int8Array(),
		type: Int8Array,
		ignore,
	},
	{
		name: 'Uint8Array',
		instance: new Uint8Array(),
		type: Uint8Array,
		ignore,
	},
	{
		name: 'Uint8ClampedArray',
		instance: new Uint8ClampedArray(),
		type: Uint8ClampedArray,
		ignore,
	},
	{
		name: 'Uint16Array',
		instance: new Uint16Array(),
		type: Uint16Array,
		ignore,
	},
	{
		name: 'Int32Array',
		instance: new Int32Array(),
		type: Int32Array,
		ignore,
	},
	{
		name: 'Uint32Array',
		instance: new Uint32Array(),
		type: Uint32Array,
		ignore,
	},
	{
		name: 'Float32Array',
		instance: new Float32Array(),
		type: Float32Array,
		ignore,
	},
	{
		name: 'Float64Array',
		instance: new Float64Array(),
		type: Float64Array,
		ignore,
	},
]

// Buffer inherited from Uint8Array
const bufferIgnore = [...ignore, Uint8Array]
const nodeBufferTypes = [
	{
		name: 'Buffer',
		instance: new Buffer(''),
		type: Buffer,
		ignore: bufferIgnore,
	},
	{
		name: 'Buffer.from',
		instance: Buffer.from([1]),
		type: Buffer,
		ignore: bufferIgnore,
	},
	{
		name: 'Buffer.alloc',
		instance: Buffer.alloc(10),
		type: Buffer,
		ignore: bufferIgnore,
	},
	{
		name: 'Buffer.allocUnsafe',
		instance: Buffer.allocUnsafe(10),
		type: Buffer,
		ignore: bufferIgnore,
	},
]

const customTypes = [
	{
		name: 'class Animal',
		instance: new Animal(),
		type: Animal,
		ignore,
	},
]

export const types = [
	...primitiveTypes,
	...functionTypes,
	...arrayTypes,
	...regexpTypes,
	...collectionTypes,
	...typedArrayTypes,
	...nodeBufferTypes,
	...customTypes,

	{ name: 'Object', instance: {}, type: Object, ignore: [] },
	{
		name: 'Object.create',
		instance: Object.create(null),
		type: Object,
		ignore: [],
	},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	{ name: 'Promise', instance: new Promise(() => {}), type: Promise, ignore },
	{ name: 'Date', instance: new Date(), type: Date, ignore },
	{ name: 'Error', instance: new Error('error'), type: Error, ignore },
]
