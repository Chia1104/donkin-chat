import { logger } from '@/utils/logger';

export const copyToClipboard = async (
	text: string,
	onCopy?: (text: string) => void,
	onFailed?: (error: unknown) => void,
) => {
	if (!navigator?.clipboard) {
		logger(['Clipboard not supported'], { type: 'warn' });
		onFailed?.('Clipboard not supported');
		return null;
	}

	try {
		await navigator.clipboard.writeText(text);
		onCopy?.(text);
		return text;
	} catch (error) {
		logger(['Copy failed', error], { type: 'warn' });
		onFailed?.(error);
		return null;
	}
};
