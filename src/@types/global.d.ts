import type en_us from '../../messages/en-US.json';
import type zh_tw from '../../messages/zh-TW.json';

type Messages = typeof en_us & typeof zh_tw;

declare global {
	// Use type safe message keys with `next-intl`
	type IntlMessages = Messages;
}
