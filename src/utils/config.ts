/**
 * Types for the config.
 */
export type RequiredConfig = Required<Config>
export type PropertiesConfig = null | undefined | Config
export type Config = {
	clone?: boolean
}

/**
 * Returns config with required properties.
 *
 * @param config
 * @returns
 */
export function useConfig(config?: PropertiesConfig): Required<Config> {
	return {
		clone: config && config.clone ? config.clone : false,
	}
}
