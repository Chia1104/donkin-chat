interface Options {
	baseUrl?: string;
	/**
	 * @todo remove duplication
	 */
	baseSearch?: `?${string}`;
}

const setSearchParams = <T extends Partial<Record<string, string | null>>>(searchParams?: T, opts?: Options) => {
	opts ??= {};
	const { baseUrl, baseSearch } = opts;
	// url without end slash and ensure with question mark
	const url = baseUrl ? baseUrl.replace(/\/$/, '').replace(/\?$/, '') + '?' : '';
	return (
		url +
		(baseSearch ? baseSearch.replace(/^\?/, '') + '&' : '') +
		Object.entries({ ...searchParams })
			.map(([key, value]) => value && `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.filter(Boolean)
			.join('&')
	);
};

export default setSearchParams;
