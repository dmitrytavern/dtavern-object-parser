import { ConfigMode } from '@types'

export const errorLog = (error: string, mode: ConfigMode) => {
	const _mode = mode ? mode : 'strict'

	switch (_mode) {
		case 'disabled':
			console.warn(
				"Mode is disabled. Please, don't use disabled mode in defineOptions"
			)
			break

		case 'log':
			console.error(new Error(error))
			break

		default:
			throw new Error(error)
	}
}
