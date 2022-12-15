/**
 * @internal
 */
export class ParserError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ParserError'
	}
}

/**
 * @internal
 */
export function mergeErrors(errors: ParserError[]) {
	const spliter = '\n  '
	return new ParserError(
		spliter + errors.map((error) => error.message).join(spliter) + spliter
	)
}
