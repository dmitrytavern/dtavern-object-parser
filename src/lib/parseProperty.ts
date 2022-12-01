import { hasOwn, isFunction, isArray, isObject } from '../utils/objects'
import { compareConstructors } from '../utils/constructor'
import {
	RawOptionSettings,
	OptionTypeSetting,
	OptionConstructorReturn,
} from '@types'

type SchemaOpitonSettings<Type extends OptionTypeSetting<any>> =
	RawOptionSettings<Type, any, any, any>

export const parseProperty = <Type extends OptionTypeSetting<any>>(
	options: object | undefined,
	optionKey: string,
	optionSchema: SchemaOpitonSettings<Type>
): OptionConstructorReturn<Type> => {
	let _optionValue = options ? options[optionKey] : undefined
	let _optionExists = options ? hasOwn(options, optionKey) : false

	const type =
		optionSchema === null
			? null
			: isArray(optionSchema)
			? optionSchema
			: isObject(optionSchema)
			? (optionSchema as SchemaOpitonSettings<Type>).type || null
			: (optionSchema as OptionTypeSetting<Type>)

	const required =
		optionSchema !== null && hasOwn(optionSchema, 'required')
			? optionSchema['required']
			: true

	const defaultValue =
		optionSchema !== null && hasOwn(optionSchema, 'default')
			? optionSchema['default']
			: null

	const validator =
		optionSchema !== null && hasOwn(optionSchema, 'validator')
			? optionSchema['validator']
			: null

	/**
	 * Exists checker
	 * -------------------------------------------------------
	 * Checking if property does not exist in options and this
	 * option is required - throw error.
	 */
	if (!_optionExists && required) throw `option not exists`

	/**
	 * Default setter
	 * -------------------------------------------------------
	 * Checking If the property does not exist in options,
	 * set default value, if it exists in the Schema
	 */
	if (!_optionExists && defaultValue !== null) {
		_optionValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue

		_optionExists = true
	}

	/**
	 * Type option checker
	 * -------------------------------------------------------
	 * Checking if the option type is correct.
	 */
	if (type !== null) {
		const _classes = isArray(type) ? type : [type]

		for (const _class of _classes)
			if (!isFunction(_class))
				throw `type of schema have no function type. No-function: ${_class}`
	}

	/**
	 * Type checker
	 * -------------------------------------------------------
	 * Checking If the property does exist, check property types
	 * form Schema
	 */
	if (type !== null && _optionExists) {
		if (!compareConstructors(_optionValue, type)) {
			const constructors = isArray(type)
				? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
				: type.prototype.constructor.name

			throw `option is not "${constructors}" type`
		}
	}

	/**
	 * Validator
	 * -------------------------------------------------------
	 * If Schema have custom validator, call this function
	 */
	if (_optionExists && validator !== null) {
		if (!validator.call(null, _optionValue))
			throw `option did not pass the validator. Value: ${_optionValue}`
	}

	return _optionValue
}
