import { OptionSettings } from '@types'

export function defineOptions<Properties>(
	properties: Properties,
	settings: OptionSettings<Properties>
): Required<Properties> {
	if (!(properties && settings))
		throw new Error('First or second function argument is not defined')

	// @ts-ignore
	return properties
}
