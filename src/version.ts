/**
 * Vestion object of the package.
 *
 * @public
 */
export const version = {
  major: process.env.VERSION_MAJOR as string,
  minor: process.env.VERSION_MINOR as string,
  patch: process.env.VERSION_PATCH as string,
  toString: () => {
    return `${version.major}.${version.minor}.${version.patch}`
  },
}
