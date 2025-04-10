import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-tw';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { env } from '@/utils/env';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

const initDayjs = (locale: Locale = env.NEXT_PUBLIC_DEFAULT_LOCALE, timezone = env.NEXT_PUBLIC_DEFAULT_TIME_ZONE) => {
	dayjs.tz.setDefault(timezone);
	dayjs.locale(locale);
};

export { initDayjs };
export default dayjs;
