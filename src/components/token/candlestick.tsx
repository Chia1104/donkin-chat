'use client';

import { createContext, use, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import type { PropsWithChildren } from 'react';

import { Spinner } from '@heroui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { ColorType, HistogramSeries, CandlestickSeries, createTextWatermark } from 'lightweight-charts';
import type { Time, ISeriesApi } from 'lightweight-charts';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import type { OlcvResponseDTO } from '@/libs/birdeye/hooks/useQueryOhlcv';
import type { KolAlert } from '@/libs/kol/pipes/kol.pipe';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { useMutationTransactions } from '@/libs/token/hooks/useQueryTransactions';
import { useTokenSearchParams } from '@/libs/token/hooks/useTokenSearchParams';
import type { Transactions, Transaction } from '@/libs/token/pipes/transactions.pipe';
import { theme as twTheme } from '@/themes/tw.theme';
import dayjs from '@/utils/dayjs';
import { logger } from '@/utils/logger';

import { useChart } from '../chart/trading-chart/chart';
import { Chart as TradingChart } from '../chart/trading-chart/chart';
import type { ClickableMarker } from '../chart/trading-chart/plugins/clickable-marker/core';
import { createClickableMarkers } from '../chart/trading-chart/plugins/clickable-marker/core';
import { MarkerTooltipProvider, MarkerTooltip } from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
import { Series } from '../chart/trading-chart/series';
import { useSeries } from '../chart/trading-chart/series';
import { SubscribeVisibleLogicalRange } from '../chart/trading-chart/subscrib-visible-logical-range';
import { ErrorBoundary } from '../commons/error-boundary';

interface CandlestickProps {
	meta: {
		price: number;
		change: number | string;
		address: string;
	};
	query: {
		type: IntervalFilter;
		time_from: number;
		time_to: number;
	};
	data: OlcvResponseDTO;
	kolAlerts?: KolAlert[];
	isPending?: boolean;
	isMetaPending?: boolean;
	transactions?: Transactions;
}

interface CandlestickPropsContext extends CandlestickProps {
	internal_data: OlcvResponseDTO;
	internal_setData: (data: OlcvResponseDTO) => void;
	internal_transactions?: Transactions;
	internal_setTransactions: (data?: Transactions) => void;
}

const CandlestickContext = createContext<CandlestickPropsContext | null>(null);

const CandlestickProvider = ({ children, ...props }: PropsWithChildren<CandlestickPropsContext>) => {
	return <CandlestickContext value={props}>{children}</CandlestickContext>;
};

const useCandlestick = () => {
	const context = use(CandlestickContext);
	if (!context) {
		throw new Error('CandlestickProvider must be used within CandlestickProvider');
	}
	return context;
};

const useGenerateTimeWithInterval = () => {
	const handleGenerateTimeWithInterval = useCallback(
		(current: number, interval: IntervalFilter, range: number): number => {
			switch (interval) {
				case IntervalFilter.OneMinute:
					return dayjs.unix(current).subtract(range, 'minutes').unix();
				case IntervalFilter.FiveMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 5, 'minutes')
						.unix();
				case IntervalFilter.FifteenMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 15, 'minutes')
						.unix();
				case IntervalFilter.ThirtyMinutes:
					return dayjs
						.unix(current)
						.subtract(range * 30, 'minutes')
						.unix();
				case IntervalFilter.OneHour:
					return dayjs.unix(current).subtract(range, 'hours').unix();
				case IntervalFilter.FourHours:
					return dayjs
						.unix(current)
						.subtract(range * 4, 'hours')
						.unix();
				case IntervalFilter.OneDay:
					return dayjs.unix(current).subtract(range, 'days').unix();
				case IntervalFilter.OneWeek:
					return dayjs.unix(current).subtract(range, 'weeks').unix();
				default:
					return dayjs.unix(current).unix();
			}
		},
		[],
	);

	return handleGenerateTimeWithInterval;
};

const SubscribeCandlestick = ({
	enable = true,
	onLoad,
}: {
	enable?: boolean;
	onLoad?: (data: OlcvResponseDTO) => void;
}) => {
	const { mutate, isPending, isError } = useMutationOhlcv();
	const {
		mutate: mutateTransactions,
		isPending: isPendingTransactions,
		isError: isErrorTransactions,
	} = useMutationTransactions();
	const { meta, query, internal_setData, internal_setTransactions } = useCandlestick();
	const [timeFrom, setTimeFrom] = useState(query.time_from);
	const series = useSeries('SubscribeCandlestick');
	const [isNoData, setIsNoData] = useState(false);
	const queryClient = useQueryClient();

	const handleGenerateTimeWithInterval = useGenerateTimeWithInterval();

	const handleSubscribe = useCallback(
		(data: OlcvResponseDTO) => {
			const previousData = queryClient.getQueryData<OlcvResponseDTO>(['birdeye', 'ohlcv', meta.address, query.type]);

			if (Array.isArray(previousData) && data.length > 0) {
				queryClient.setQueryData<OlcvResponseDTO>(['birdeye', 'ohlcv', meta.address, query.type], prev => {
					if (!prev) {
						return [];
					}

					const _data = [...data, ...prev];

					series.api().setData(
						_data.map(item => ({
							...item,
							time: item.unix as Time,
						})),
					);

					internal_setData(_data);

					onLoad?.(_data);

					return _data;
				});
			}
		},
		[internal_setData, meta.address, onLoad, query.type, queryClient, series],
	);

	const handleSubscribeTransactions = useCallback(
		(data: Transactions, timeFrom: number) => {
			queryClient.setQueryData<Transactions>(['token', 'transactions', meta.address, query.type], prev => {
				if (!prev) {
					return data;
				}

				const newData = {
					...prev,
					start_time: dayjs.unix(timeFrom).format('YYYY-MM-DD'),
					buy_groups: [...(prev?.buy_groups ?? []), ...(data?.buy_groups ?? [])],
					sell_groups: [...(prev?.sell_groups ?? []), ...(data?.sell_groups ?? [])],
				};
				internal_setTransactions(newData);

				return newData;
			});
		},
		[queryClient, meta.address, query.type, internal_setTransactions],
	);

	const handleSubscribeVisibleLogicalRange = useCallback(
		(range: number) => {
			if (isPending || isNoData || isError) {
				return;
			}
			const numberBarsToLoad = 50 - range;
			const newTimeFrom = handleGenerateTimeWithInterval(timeFrom, query.type, numberBarsToLoad);
			const newTimeTo = handleGenerateTimeWithInterval(timeFrom, query.type, 0);
			setTimeFrom(newTimeFrom);
			mutate(
				{
					data: {
						address: meta.address,
						type: query.type,
						time_from: newTimeFrom,
						time_to: newTimeTo,
					},
				},
				{
					onSuccess: _data => {
						const data = _data.map(item => ({
							...item,
							time: item.unix as Time,
						}));

						if (data.length === 0) {
							setIsNoData(true);
						} else {
							setIsNoData(false);
							handleSubscribe(data);
							mutateTransactions(
								{
									token_address: meta.address,
									start_time: dayjs.unix(newTimeFrom).format('YYYY-MM-DD'),
									end_time: dayjs.unix(newTimeTo).format('YYYY-MM-DD'),
								},
								{
									onSuccess: data => {
										handleSubscribeTransactions(data, newTimeFrom);
									},
									onError: error => {
										logger(error, { type: 'error' });
										toast.error('Failed to load transactions');
									},
								},
							);
						}
					},
					onError: error => {
						logger(error, { type: 'error' });
						toast.error('Failed to load data');
					},
				},
			);
		},
		[
			isPending,
			isNoData,
			isError,
			handleGenerateTimeWithInterval,
			timeFrom,
			query.type,
			mutate,
			meta.address,
			handleSubscribe,
			mutateTransactions,
			handleSubscribeTransactions,
		],
	);

	if (!enable) {
		return null;
	}

	return (
		<SubscribeVisibleLogicalRange
			enabled={!isPending && !isNoData && !isError && !isPendingTransactions && !isErrorTransactions}
			method={handleSubscribeVisibleLogicalRange}
		/>
	);
};

const NoDataWatermark = ({ data, text = 'No data' }: { data: OlcvResponseDTO; text?: string }) => {
	const chart = useChart();

	useEffect(() => {
		if (data.length === 0) {
			const firstPane = chart.api().panes()[0];
			createTextWatermark(firstPane, {
				horzAlign: 'center',
				vertAlign: 'center',
				lines: [
					{
						text,
						color: twTheme.extend.colors.description.DEFAULT,
						fontSize: 24,
					},
				],
			});
		}
	}, [data, chart, text]);
	return null;
};

const ClickableMarkerSeries = () => {
	const { kolAlerts, internal_data } = useCandlestick();
	const chart = useChart('ClickableMarker');
	const series = useSeries('ClickableMarker');
	const [searchParams] = useTokenSearchParams();
	const loudspeakerMarkers: ClickableMarker<Time>[] = useMemo(() => {
		if (!kolAlerts) {
			return [];
		}

		// 找出 data 中最早的 unix 時間
		const earliestUnixTime = internal_data.length > 0 ? Math.min(...internal_data.map(item => item.unix)) : 0;

		// 過濾掉早於 data 中最早時間的 kolAlerts
		const markers = kolAlerts
			.filter(item => dayjs(item.day).utc().unix() >= earliestUnixTime)
			.map(item => ({
				time: dayjs(item.day).utc().unix() as Time,
				position: 'aboveBar',
				color: 'rgba(255, 181, 34, 1)',
				size: 1,
				type: 'loudspeaker',
				text: `+${item.kol_alerts}`,
			}));

		return markers.sort((a, b) => (a.time as number) - (b.time as number)) as ClickableMarker<Time>[];
	}, [kolAlerts, internal_data]);

	useEffect(() => {
		const chartApi = chart._api;
		const seriesApi = series._api;
		let clean: (() => void) | undefined;
		if (loudspeakerMarkers.length > 0 && chartApi && seriesApi && searchParams.mark) {
			const seriesMarkers = createClickableMarkers<Time>(chartApi, seriesApi, loudspeakerMarkers, {
				onClick: marker => {
					logger(marker);
				},
			});
			clean = seriesMarkers.detach;
		}

		return () => {
			if (!series.isDisposed()) {
				clean?.();
			}
		};
	}, [loudspeakerMarkers, chart, series, searchParams.mark]);
	return null;
};

const TransactionMarkers = () => {
	const { internal_transactions, internal_data, query } = useCandlestick();
	const chart = useChart('TransactionMarkers');
	const series = useSeries('TransactionMarkers');
	const [searchParams] = useTokenSearchParams();

	const transactionMarkers: ClickableMarker<Time>[] = useMemo(() => {
		if (
			!internal_transactions ||
			(!internal_transactions.buy_groups && !internal_transactions.sell_groups) ||
			internal_data.length === 0
		) {
			return [];
		}

		// 找出 data 中最早和最晚的 unix 時間
		const earliestUnixTime = Math.min(...internal_data.map(item => item.unix));
		const latestUnixTime = Math.max(...internal_data.map(item => item.unix));

		const allTransactions: { type: 'buy' | 'sell'; transaction: Transaction }[] = [];

		// 處理買入交易
		if (internal_transactions.buy_groups) {
			internal_transactions.buy_groups.forEach(group => {
				group.transactions.forEach(tx => {
					allTransactions.push({
						type: 'buy',
						transaction: tx,
					});
				});
			});
		}

		// 處理賣出交易
		if (internal_transactions.sell_groups) {
			internal_transactions.sell_groups.forEach(group => {
				group.transactions.forEach(tx => {
					allTransactions.push({
						type: 'sell',
						transaction: tx,
					});
				});
			});
		}

		// 根據 IntervalFilter 篩選和聚合交易
		// 將交易依據時間間隔進行分組
		const groupedTransactions = new Map<number, { buys: Transaction[]; sells: Transaction[] }>();

		allTransactions.forEach(({ type, transaction }) => {
			const txTime = dayjs(transaction.timestamp).unix();

			// 檢查交易是否在圖表時間範圍內
			if (txTime < earliestUnixTime || txTime > latestUnixTime) {
				return;
			}

			// 根據不同的時間間隔將交易分組到相應的 K 線蠟燭中
			let groupKey = txTime;
			switch (query.type) {
				case IntervalFilter.OneMinute:
					groupKey = Math.floor(txTime / 60) * 60;
					break;
				case IntervalFilter.FiveMinutes:
					groupKey = Math.floor(txTime / (5 * 60)) * (5 * 60);
					break;
				case IntervalFilter.FifteenMinutes:
					groupKey = Math.floor(txTime / (15 * 60)) * (15 * 60);
					break;
				case IntervalFilter.ThirtyMinutes:
					groupKey = Math.floor(txTime / (30 * 60)) * (30 * 60);
					break;
				case IntervalFilter.OneHour:
					groupKey = Math.floor(txTime / (60 * 60)) * (60 * 60);
					break;
				case IntervalFilter.FourHours:
					groupKey = Math.floor(txTime / (4 * 60 * 60)) * (4 * 60 * 60);
					break;
				case IntervalFilter.OneDay:
					groupKey = Math.floor(txTime / (24 * 60 * 60)) * (24 * 60 * 60);
					break;
				case IntervalFilter.OneWeek:
					groupKey = Math.floor(txTime / (7 * 24 * 60 * 60)) * (7 * 24 * 60 * 60);
					break;
			}

			if (!groupedTransactions.has(groupKey)) {
				groupedTransactions.set(groupKey, { buys: [], sells: [] });
			}

			const group = groupedTransactions.get(groupKey);
			if (!group) return;

			if (type === 'buy') {
				group.buys.push(transaction);
			} else {
				group.sells.push(transaction);
			}
		});

		// 將分組後的交易轉換為標記
		const markers: ClickableMarker<Time>[] = [];

		groupedTransactions.forEach((group, time) => {
			// 添加買入標記
			if (group.buys.length > 0) {
				markers.push({
					time: time as Time,
					position: 'aboveBar',
					color: twTheme.extend.colors.buy.DEFAULT,
					size: 1,
					type: 'buy',
				});
			}

			// 添加賣出標記
			if (group.sells.length > 0) {
				markers.push({
					time: time as Time,
					position: 'aboveBar',
					color: twTheme.extend.colors.sell.DEFAULT,
					size: 1,
					type: 'sell',
				});
			}
		});

		return markers.sort((a, b) => (a.time as number) - (b.time as number));
	}, [internal_transactions, internal_data, query.type]);

	useEffect(() => {
		const chartApi = chart._api;
		const seriesApi = series._api;
		let clean: (() => void) | undefined;
		if (chartApi && seriesApi && searchParams.mark) {
			const seriesMarkers = createClickableMarkers<Time>(chartApi, seriesApi, transactionMarkers, {
				onClick: marker => {
					logger(['TransactionMarkers', marker]);
				},
			});
			clean = seriesMarkers.detach;
		}

		return () => {
			if (!series.isDisposed()) {
				clean?.();
			}
		};
	}, [transactionMarkers, chart, series, searchParams.mark]);

	return null;
};

const Chart = () => {
	const tUtils = useTranslations('utils');
	const locale = useLocale();
	const [initOptions] = useState({
		autoSize: true,
		layout: {
			textColor: '#9B9EAB',
			background: { type: ColorType.Solid, color: 'transparent' },
			attributionLogo: false,
		},
		grid: {
			vertLines: {
				color: 'transparent',
			},
			horzLines: {
				color: 'transparent',
			},
		},
		localization: {
			locale,
		},
		timeScale: {
			timeVisible: true,
		},
	});
	const histogramSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

	const { data, isPending } = useCandlestick();

	const initData = useMemo(() => {
		return data.map(item => ({
			...item,
			value: item.volume,
			time: item.unix as Time,
			color: item.close > item.open ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.sell.disabled,
		}));
	}, [data]);

	const handleSubscribeHistogram = useCallback((data: OlcvResponseDTO) => {
		if (histogramSeriesRef.current) {
			histogramSeriesRef.current.setData(
				data.map(item => ({
					value: item.volume,
					time: item.unix as Time,
					color: item.close > item.open ? twTheme.extend.colors.buy.disabled : twTheme.extend.colors.sell.disabled,
				})),
			);
		}
	}, []);

	if (isPending) {
		return (
			<div className="flex items-center justify-center w-full h-[55dvh]">
				<Spinner />
			</div>
		);
	}

	return (
		<TradingChart
			className="h-[55dvh]"
			initOptions={initOptions}
			onInit={c => {
				if (data.length < 50) {
					c.timeScale().fitContent();
				}
			}}
		>
			<NoDataWatermark data={data} text={tUtils('no-data')} />
			<Series
				series={CandlestickSeries}
				data={initData.map(item => ({
					...item,
					color: undefined,
				}))}
				options={{
					upColor: twTheme.extend.colors.buy.DEFAULT,
					downColor: twTheme.extend.colors.sell.DEFAULT,
					borderVisible: false,
					wickUpColor: twTheme.extend.colors.buy.DEFAULT,
					wickDownColor: twTheme.extend.colors.sell.DEFAULT,
				}}
			>
				<SubscribeCandlestick onLoad={handleSubscribeHistogram} />
				<ClickableMarkerSeries />
				<TransactionMarkers />
			</Series>
			<Series
				ref={histogramSeriesRef}
				series={HistogramSeries}
				data={initData}
				options={{
					priceFormat: {
						type: 'volume',
					},
					priceScaleId: '',
				}}
				onInit={series => {
					series.priceScale().applyOptions({
						scaleMargins: {
							top: 0.8,
							bottom: 0,
						},
					});
				}}
			/>
		</TradingChart>
	);
};

const Candlestick = (props: CandlestickProps) => {
	const [internalDdata, setInternalData] = useState<OlcvResponseDTO>(props.data);
	const [internalTransactions, setInternalTransactions] = useState<Transactions | undefined>(props.transactions);
	return (
		<CandlestickProvider
			{...props}
			internal_data={internalDdata}
			internal_setData={setInternalData}
			internal_transactions={internalTransactions}
			internal_setTransactions={setInternalTransactions}
		>
			<ErrorBoundary>
				<MarkerTooltipProvider>
					<Chart key={props.query.type} />
					<MarkerTooltip />
				</MarkerTooltipProvider>
			</ErrorBoundary>
		</CandlestickProvider>
	);
};

export default Candlestick;
