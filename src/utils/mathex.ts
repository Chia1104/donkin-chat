export function ceiledEven(x: number): number {
	const ceiled = Math.ceil(x);
	return ceiled % 2 !== 0 ? ceiled - 1 : ceiled;
}

export function ceiledOdd(x: number): number {
	const ceiled = Math.ceil(x);
	return ceiled % 2 === 0 ? ceiled - 1 : ceiled;
}
