import { setMetadata, hasMetadata, getMetadata } from '../utils/metadata'
import { isArray, isObject, isFunction, hasOwn } from 'src/utils/objects'
import { createSchema } from './createSchema'
import {
	PropertyOptions,
	PropertyType,
	PropertyTypeArray,
	PropertyRequired,
	PropertyDefault,
	PropertyValidator,
	PropertyOptionsRaw,
} from '@types'

const defaultOptions = {
	type: null,
	typeElement: null,
	required: true,
	default: null,
	validator: null,
}

const propertyKeys = Object.keys(defaultOptions)

export const isSchemaProperty = (object: object): boolean =>
	hasMetadata(object) ? getMetadata(object, 'isSettings') : false

export const createSchemaProperty = <
	Type extends PropertyType,
	TypeArray extends PropertyTypeArray,
	Required extends PropertyRequired,
	Default extends PropertyDefault<Type, TypeArray>,
	Validator extends PropertyValidator<Type, TypeArray>
>(
	opitons: PropertyOptionsRaw<Type, TypeArray, Required, Default, Validator>
): PropertyOptions<Type, TypeArray, Required, Default, Validator> => {
	if (!isObject(opitons)) {
		throw 'opitons is not object'
	}

	if (hasMetadata(opitons)) {
		throw 'object already defined as schema or property options'
	}

	for (const key of Object.keys(opitons))
		if (!propertyKeys.includes(key))
			throw `unknown setting key "${key}" in options`

	let _isArray = false
	if (hasOwn(opitons, 'type') && opitons.type !== null) {
		const _types = isArray(opitons.type) ? opitons.type : [opitons.type]
		const errors = []

		for (const _type of _types) {
			if (_type === Array) _isArray = true
			if (!isFunction(_type)) errors.push(_type)
		}

		if (errors.length > 0) {
			const s = errors.join(', ')
			throw `type setting have no function type. No-function: ${s}`
		}
	}

	if (hasOwn(opitons, 'validator'))
		if (!isFunction(opitons.validator))
			throw `validator setting is not function`

	const opitonsClone = Object.assign({}, defaultOptions, opitons)

	opitonsClone.type = isArray(opitonsClone.type)
		? Object.freeze([...opitonsClone.type])
		: opitonsClone.type

	if (_isArray)
		opitonsClone.typeElement =
			opitonsClone.typeElement === null
				? createSchemaProperty({})
				: hasMetadata(opitonsClone.typeElement)
				? opitonsClone.typeElement
				: createSchemaProperty({ type: opitonsClone.typeElement })
	else if (opitonsClone.typeElement !== null)
		throw 'typeElement property exists, but type is not array'

	setMetadata(opitonsClone, 'isSchema', false)
	setMetadata(opitonsClone, 'isSettings', true)

	return Object.freeze(opitonsClone)
}
