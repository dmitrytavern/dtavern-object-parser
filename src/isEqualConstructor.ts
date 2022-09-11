/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptionPropertyTypes } from '@types'
import { isArray } from './utils'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AsyncFunction = new Function(`return async () => {}`)().constructor

export const isEqualConstructor = (
	propertyValue: any,
	types: OptionPropertyTypes<any>
): boolean => {
	const _classes = isArray(types) ? types : [types]
	let equals = false

	for (const _class of _classes)
		if (!equals && propertyValue !== null && propertyValue !== undefined)
			equals = propertyValue.constructor === _class

	return equals
}
