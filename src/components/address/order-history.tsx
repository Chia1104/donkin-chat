'use client';

import { createContext, use, useMemo, useState, useRef } from 'react';
import type { PropsWithChildren } from 'react';

import { Avatar } from '@heroui/avatar';
import { Button, ButtonGroup } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Spinner } from '@heroui/spinner';
import { Tabs, Tab } from '@heroui/tabs';
import { Tooltip } from '@heroui/tooltip';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ColorType, HistogramSeries, AreaSeries } from 'lightweight-charts';
import type { Time, ISeriesApi } from 'lightweight-charts';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

import { experimental_useTailwindTheme as useTailwindTheme } from '@/hooks/useTailwindTheme';
import { DisplayFilter as TDisplayFilter } from '@/libs/address/enums/display-filter.enum';
import { IntervalFilter } from '@/libs/address/enums/interval-filter.enum';
import { useAddressSearchParams } from '@/libs/address/hooks/useAddressSearchParams';
import { cn } from '@/utils/cn';
import { truncateMiddle, roundDecimal, formatLargeNumber } from '@/utils/format';
import { isPositiveNumber, isNumber } from '@/utils/is';

import { Chart } from '../chart/trading-chart/chart';
import { MarkerTooltipProvider, MarkerTooltip } from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';
import CopyButton from '../commons/copy-button';
import DonkinPopover from '../donkin/popover';

export interface OrderHistoryDataItem {
	time: Time;
	value: number;
	isProfit?: boolean;
}

interface OrderHistoryProps {
	meta: {
		avatar?: string;
		address: string;
		volume: number | string;
		profit: string;
	};
	win: {
		rate: number;
	};
	profit: {
		rate: number;
		amount: number;
	};
	balanceData: OrderHistoryDataItem[];
	profitLossData: OrderHistoryDataItem[];
	isPending?: boolean;
	isMetaPending?: boolean;
}

const OrderHistoryContext = createContext<OrderHistoryProps | null>(null);

const OrderHistoryProvider = ({ children, ...props }: PropsWithChildren<OrderHistoryProps>) => {
	return <OrderHistoryContext value={props}>{children}</OrderHistoryContext>;
};

const useOrderHistory = () => {
	const context = use(OrderHistoryContext);
	if (!context) {
		throw new Error('useOrderHistory must be used within OrderHistoryProvider');
	}
	return context;
};

const DisplayFilter = () => {
	const [searchParams, setSearchParams] = useAddressSearchParams();
	const t = useTranslations('address.order-history');

	return (
		<ButtonGroup variant="light" size="sm">
			<Button
				className="text-description px-2 py-0"
				onPress={() => {
					void setSearchParams({
						display: searchParams.display.includes(TDisplayFilter.BalanceHistory)
							? searchParams.display.filter(item => item !== TDisplayFilter.BalanceHistory)
							: [...searchParams.display, TDisplayFilter.BalanceHistory],
					});
				}}
				startContent={
					<Image
						src={
							searchParams.display.includes(TDisplayFilter.BalanceHistory)
								? '/assets/images/balance.svg'
								: '/assets/images/balance-disabled.svg'
						}
						alt="balance"
						width={16}
						height={16}
						removeWrapper
						className="rounded-none"
					/>
				}
			>
				{t('balance-history')}
			</Button>
			<Button
				className="text-description px-2 py-0"
				onPress={() => {
					void setSearchParams({
						display: searchParams.display.includes(TDisplayFilter.ProfitLoss)
							? searchParams.display.filter(item => item !== TDisplayFilter.ProfitLoss)
							: [...searchParams.display, TDisplayFilter.ProfitLoss],
					});
				}}
				startContent={
					<Image
						src={
							searchParams.display.includes(TDisplayFilter.ProfitLoss)
								? '/assets/images/profit.svg'
								: '/assets/images/profit-disabled.svg'
						}
						alt="profit"
						width={8}
						height={8}
						removeWrapper
						className="rounded-none"
					/>
				}
			>
				{t('profit-loss')}
			</Button>
		</ButtonGroup>
	);
};

const DateFilter = () => {
	const [searchParams, setSearchParams] = useAddressSearchParams();

	return (
		<ScrollShadow orientation="horizontal" className="w-fit">
			<Tabs
				aria-label="interval"
				size="sm"
				variant="light"
				selectedKey={searchParams.interval}
				onSelectionChange={key => {
					void setSearchParams({
						interval: key as IntervalFilter,
					});
				}}
			>
				<Tab key={IntervalFilter.OneWeek} title={IntervalFilter.OneWeek} className="px-2 py-0" />
				<Tab key={IntervalFilter.OneMonth} title={IntervalFilter.OneMonth} className="px-2 py-0" />
			</Tabs>
		</ScrollShadow>
	);
};

const Meta = () => {
	const { meta } = useOrderHistory();
	const tAskMore = useTranslations('donkin.ask-more');

	const isPositive = isPositiveNumber(meta.profit) || (typeof meta.profit === 'string' && meta.profit.startsWith('+'));

	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-4">
				<Avatar src={meta.avatar} size="md" className="w-12 h-12" />
				<span className="flex items-center gap-2">
					<Tooltip
						classNames={{
							content: 'bg-transparent shadow-none p-0',
						}}
						content={
							<DonkinPopover
								className="w-[220px]"
								askMore={[tAskMore('address-detail.history-analysis'), tAskMore('address-detail.current-holdings')]}
							/>
						}
					>
						<p className="text-sm font-normal">{truncateMiddle(meta.address ?? '', 10)}</p>
					</Tooltip>
					<CopyButton content={meta.address} />
				</span>
				<Divider orientation="vertical" className="h-4" />
				<p className="text-[22px] font-normal">${isNumber(meta.volume) ? roundDecimal(meta.volume, 0) : meta.volume}</p>
				<span className="flex items-center gap-1">
					<p className={cn('text-xs font-normal', isPositive ? 'text-success' : 'text-danger')}>
						{isPositive && '+'}
						{isNumber(meta.profit) ? roundDecimal(meta.profit, 2) : meta.profit}%
					</p>
					{isPositive ? (
						<TrendingUpIcon sx={{ width: 12, height: 12 }} color="success" />
					) : (
						<TrendingDownIcon sx={{ width: 12, height: 12 }} color="error" />
					)}
				</span>
			</div>
			<DateFilter />
		</div>
	);
};
const Header = () => {
	const t = useTranslations('address.order-history');
	const { win, profit } = useOrderHistory();
	return (
		<div className="flex justify-between items-center w-full">
			<div className="flex items-center gap-2">
				<h3 className="text-[16px] font-normal text-white/65">{t('title')}</h3>
				<DisplayFilter />
			</div>
			<div className="flex items-center gap-4">
				<span className="flex items-center gap-2">
					<p className="text-description text-xs font-normal">{t('win-rate')}</p>
					<p className="text-sm font-normal">{win.rate}%</p>
				</span>
				<Divider orientation="vertical" className="h-4" />
				<span className="flex items-center gap-2">
					<p className="text-description text-xs font-normal">{t('profit-loss-rate')}</p>
					<p className="text-sm font-normal">
						{profit.rate}% ({isPositiveNumber(profit.amount) ? '+' : '-'}$
						{isNumber(profit.amount) ? formatLargeNumber(profit.amount) : profit.amount})
					</p>
				</span>
			</div>
		</div>
	);
};

const OrderChart = () => {
	const locale = useLocale();
	const [searchParams] = useAddressSearchParams();
	const [initOptions] = useState({
		autoSize: true,
		layout: {
			textColor: 'rgba(255, 255, 255, 0.25)',
			background: { type: ColorType.Solid, color: 'transparent' },
			attributionLogo: false,
		},
		grid: {
			vertLines: {
				color: 'rgba(255, 255, 255, 0.06)',
			},
			horzLines: {
				color: 'rgba(255, 255, 255, 0.06)',
			},
		},
		localization: {
			locale,
		},
		timeScale: {
			timeVisible: true,
		},
	});
	const twTheme = useTailwindTheme();
	const areaSeriesRef = useRef<ISeriesApi<'Area'>>(null);
	const histogramSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

	const { balanceData, profitLossData, isPending } = useOrderHistory();

	const formattedHistogramData = useMemo(() => {
		return profitLossData.map(item => ({
			time: item.time,
			value: item.value,
			color: item.isProfit ? twTheme.theme.colors.buy.DEFAULT : twTheme.theme.colors.sell.DEFAULT,
		}));
	}, [profitLossData, twTheme.theme.colors]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[342px]">
				<Spinner />
			</div>
		);
	}

	return (
		<Chart
			className="h-[55dvh]"
			initOptions={initOptions}
			onInit={c => {
				c.timeScale().fitContent();
			}}
		>
			{searchParams.display.includes(TDisplayFilter.BalanceHistory) && (
				<Series
					ref={areaSeriesRef}
					series={AreaSeries}
					data={balanceData}
					options={{
						lineColor: '#38AF75',
						topColor: 'rgba(69, 146, 109, 0.4)',
						bottomColor: 'rgba(24, 25, 29, 0)',
						lineWidth: 2,
						priceFormat: {
							type: 'price',
							precision: 2,
							minMove: 0.01,
						},
					}}
				/>
			)}
			{searchParams.display.includes(TDisplayFilter.ProfitLoss) && (
				<Series
					ref={histogramSeriesRef}
					series={HistogramSeries}
					data={formattedHistogramData}
					options={{
						priceFormat: {
							type: 'price',
							precision: 2,
							minMove: 0.01,
						},
					}}
				/>
			)}
		</Chart>
	);
};

const OrderHistory = (props: OrderHistoryProps) => {
	return (
		<OrderHistoryProvider {...props}>
			<section className="w-full rounded-lg flex flex-col gap-6">
				<Meta />
				<Header />
				<MarkerTooltipProvider>
					<OrderChart />
					<MarkerTooltip />
				</MarkerTooltipProvider>
			</section>
		</OrderHistoryProvider>
	);
};

export default OrderHistory;
