/**
 * Vestion object of the package.
 *
 * @public
 */
export const version = {
	major: process.env.VERSION_MAJOR,
	minor: process.env.VERSION_MINOR,
	patch: process.env.VERSION_PATCH,
	toString: () => {
		return `${version.major}.${version.minor}.${version.patch}`
	},
}
