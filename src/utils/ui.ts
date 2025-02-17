export const copyToClipboard = async (
	text: string,
	onCopy?: (text: string) => void,
	onFailed?: (error: unknown) => void,
) => {
	if (!navigator?.clipboard) {
		console.warn('Clipboard not supported');
		onFailed?.('Clipboard not supported');
		return null;
	}

	try {
		await navigator.clipboard.writeText(text);
		onCopy?.(text);
		return text;
	} catch (error) {
		console.warn('Copy failed', error);
		onFailed?.(error);
		return null;
	}
};
