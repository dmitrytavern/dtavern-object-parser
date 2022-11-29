export type ConfigMode = 'strict' | 'log' | 'disabled'

export interface Config {
	mode?: ConfigMode
	clone?: boolean
}
