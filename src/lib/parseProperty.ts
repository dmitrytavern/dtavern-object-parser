import { hasOwn, isFunction, isArray, isObject } from '../utils/objects'
import { compareConstructors, validateConstructors } from '../utils/constructor'
import {
	RawOptionSettings,
	OptionTypeSetting,
	ParsePropertyResponse,
} from '@types'

type SchemaOpitonSettings<Type extends OptionTypeSetting<any>> =
	RawOptionSettings<Type, any, any, any>

export const parseProperty = <Type extends OptionTypeSetting<any>>(
	options: object | undefined,
	optionKey: string,
	optionSchema: SchemaOpitonSettings<Type>
): ParsePropertyResponse => {
	let _optionValue = options ? options[optionKey] : undefined
	let _optionExists = options ? hasOwn(options, optionKey) : false

	const _response: ParsePropertyResponse = {
		isChanged: false,
		value: _optionValue,
		errors: [],
	}

	if (!isObject(optionSchema)) {
		_response.errors.push(`schema is not object`)
		return _response
	}

	const type =
		optionSchema !== null && hasOwn(optionSchema, 'type')
			? optionSchema['type']
			: null

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
	if (!_optionExists && required) {
		_response.errors.push(`option not exists`)
	}

	/**
	 * Default setter
	 * -------------------------------------------------------
	 * Checking If the property does not exist in options,
	 * set default value, if it exists in the Schema
	 */
	if (!_optionExists && !required && defaultValue !== null) {
		_optionValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue

		_optionExists = true
		_response.value = _optionValue
		_response.isChanged = true
	}

	/**
	 * Type option checker
	 * -------------------------------------------------------
	 * Checking if the option type is correct.
	 */
	if (type !== null) {
		const errors = validateConstructors(type)

		if (errors.length > 0)
			for (const error of errors)
				_response.errors.push(
					`type setting have no function type. No-function: ${error}`
				)
	}

	/**
	 * Type checker
	 * -------------------------------------------------------
	 * Checking If the property does exist, check property types
	 * form Schema
	 */
	if (type !== null && _optionExists && _response.errors.length === 0) {
		if (!compareConstructors(_optionValue, type)) {
			const constructors = isArray(type)
				? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
				: type.prototype.constructor.name

			_response.errors.push(`option is not "${constructors}" type`)
		}
	}

	/**
	 * Validator
	 * -------------------------------------------------------
	 * If Schema have custom validator, call this function
	 */
	if (_optionExists && validator !== null && _response.errors.length === 0) {
		if (!validator.call(null, _optionValue))
			_response.errors.push(
				`option did not pass the validator. Value: ${_optionValue}`
			)
	}

	return _response
}
