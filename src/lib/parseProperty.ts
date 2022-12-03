import { hasOwn, isFunction, isArray } from '../utils/objects'
import { compareConstructors } from '../utils/constructor'
import {
	isSchemaProperty,
	createSchemaProperty,
} from '../schema/createSchemaProperty'
import {
	OptionSettings,
	RawOptionSettings,
	OptionTypeSetting,
	ParsePropertyResponse,
} from '@types'

type SchemaOpitonSettings = OptionSettings<any, any, any, any>
type RawSchemaOpitonSettings<Type extends OptionTypeSetting<any>> =
	| null
	| undefined
	| RawOptionSettings<Type, any, any, any>

export const parseProperty = <Type extends OptionTypeSetting<any>>(
	options: object | undefined,
	optionKey: string,
	optionSchema: RawSchemaOpitonSettings<Type>
): ParsePropertyResponse => {
	let _optionValue = options ? options[optionKey] : undefined
	let _optionExists = options ? hasOwn(options, optionKey) : false

	const schema = parseSettings(optionSchema)
	const response: ParsePropertyResponse = {
		isChanged: false,
		value: _optionValue,
		errors: [],
	}

	if (typeof schema === 'string') {
		response.errors.push(schema)
		return response
	}

	/**
	 * Exists checker
	 * -------------------------------------------------------
	 * Checking if property does not exist in options and this
	 * option is required - throw error.
	 */
	const required = schema.required
	if (!_optionExists && required) {
		response.errors.push(`property not exists`)
	}

	/**
	 * Default setter
	 * -------------------------------------------------------
	 * Checking If the property does not exist in options,
	 * set default value, if it exists in the Schema
	 */
	const defaultValue = schema.default
	if (!_optionExists && !required && defaultValue !== null) {
		_optionValue = isFunction(defaultValue)
			? defaultValue.apply(null)
			: defaultValue

		_optionExists = true
		response.value = _optionValue
		response.isChanged = true
	}

	/**
	 * Type checker
	 * -------------------------------------------------------
	 * Checking If the property does exist, check property types
	 * form Schema
	 */
	const type = schema.type
	if (type !== null && _optionExists && response.errors.length === 0) {
		if (!compareConstructors(_optionValue, type)) {
			const constructors = isArray(type)
				? `[${type.map((x) => x.prototype.constructor.name).join(', ')}]`
				: type.prototype.constructor.name

			response.errors.push(`property is not "${constructors}" type`)
		}
	}

	/**
	 * Validator
	 * -------------------------------------------------------
	 * If Schema have custom validator, call this function
	 */
	const validator = schema.validator
	if (_optionExists && validator !== null && response.errors.length === 0) {
		if (!validator.call(null, _optionValue))
			response.errors.push(
				`property did not pass the validator. Value: ${_optionValue}`
			)
	}

	return response
}

const parseSettings = (
	settings: RawSchemaOpitonSettings<any>
): SchemaOpitonSettings | string => {
	try {
		if (isSchemaProperty(settings)) return settings as SchemaOpitonSettings
		return createSchemaProperty(settings)
	} catch (e) {
		return e
	}
}
