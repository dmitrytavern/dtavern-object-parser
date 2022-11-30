import { OptionTypeSetting, AsyncFunctionType } from '@types'
import { isArray } from './utils'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AsyncFunction: AsyncFunctionType = new Function(
	`return async () => {}`
)().constructor

export const isEqualConstructor = (
	propertyValue: any,
	types: OptionTypeSetting<any>
): boolean => {
	const _classes = isArray(types) ? types : [types]
	let equals = false

	for (const _class of _classes)
		if (!equals && propertyValue !== null && propertyValue !== undefined)
			equals = propertyValue.constructor === _class

	return equals
}
