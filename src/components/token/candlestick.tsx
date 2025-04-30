'use client';

import { createContext, use, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import type { PropsWithChildren } from 'react';

import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { ColorType, HistogramSeries, CandlestickSeries, createTextWatermark } from 'lightweight-charts';
import type { Time, ISeriesApi } from 'lightweight-charts';
import { useLocale, useTranslations } from 'next-intl';

import OrderPopover from '@/components/token/order-popover';
import { useAskTokenTrade } from '@/libs/ai/hooks/useAskTokenTrade';
import { useMutationOhlcv } from '@/libs/birdeye/hooks/useQueryOhlcv';
import type { OlcvResponseDTO } from '@/libs/birdeye/hooks/useQueryOhlcv';
import type { KolAlert } from '@/libs/kol/pipes/kol.pipe';
import { Address } from '@/libs/token/enums/address.enum';
import { IntervalFilter } from '@/libs/token/enums/interval-filter.enum';
import { Order } from '@/libs/token/enums/order.enum';
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
import {
	MarkerTooltipProvider,
	MarkerTooltip,
	useMarkerTooltipStore,
} from '../chart/trading-chart/plugins/clickable-marker/marker-tooltip';
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
		(current: number, interval: IntervalFilter, range: number, action = 'subtract'): number => {
			switch (interval) {
				case IntervalFilter.OneMinute:
					return action === 'subtract'
						? dayjs.unix(current).subtract(range, 'minutes').unix()
						: dayjs.unix(current).add(range, 'minutes').unix();
				case IntervalFilter.FiveMinutes:
					return action === 'subtract'
						? dayjs
								.unix(current)
								.subtract(range * 5, 'minutes')
								.unix()
						: dayjs
								.unix(current)
								.add(range * 5, 'minutes')
								.unix();
				case IntervalFilter.FifteenMinutes:
					return action === 'subtract'
						? dayjs
								.unix(current)
								.subtract(range * 15, 'minutes')
								.unix()
						: dayjs
								.unix(current)
								.add(range * 15, 'minutes')
								.unix();
				case IntervalFilter.ThirtyMinutes:
					return action === 'subtract'
						? dayjs
								.unix(current)
								.subtract(range * 30, 'minutes')
								.unix()
						: dayjs
								.unix(current)
								.add(range * 30, 'minutes')
								.unix();
				case IntervalFilter.OneHour:
					return action === 'subtract'
						? dayjs.unix(current).subtract(range, 'hours').unix()
						: dayjs.unix(current).add(range, 'hours').unix();
				case IntervalFilter.FourHours:
					return action === 'subtract'
						? dayjs
								.unix(current)
								.subtract(range * 4, 'hours')
								.unix()
						: dayjs
								.unix(current)
								.add(range * 4, 'hours')
								.unix();
				case IntervalFilter.OneDay:
					return action === 'subtract'
						? dayjs.unix(current).subtract(range, 'days').unix()
						: dayjs.unix(current).add(range, 'weeks').unix();
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
	const tUnableToLoad = useTranslations('utils.unable-to-load');

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
			const numberBarsToLoad = 150 - range;
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
										addToast({
											title: tUnableToLoad('title'),
											description: tUnableToLoad('description'),
											color: 'danger',
										});
									},
								},
							);
						}
					},
					onError: error => {
						logger(error, { type: 'error' });
						addToast({
							title: tUnableToLoad('title'),
							description: tUnableToLoad('description'),
							color: 'danger',
						});
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
			tUnableToLoad,
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

const TransactionMarkers = () => {
	const { internal_transactions, internal_data, query, kolAlerts, meta } = useCandlestick();
	const chart = useChart('TransactionMarkers');
	const series = useSeries('TransactionMarkers');
	const tAskMore = useTranslations('donkin.ask-more.kol-order');
	const [searchParams] = useTokenSearchParams();
	const openTooltip = useMarkerTooltipStore(state => state.openTooltip);
	const closeTooltip = useMarkerTooltipStore(state => state.closeTooltip);
	const generateTimeWithInterval = useGenerateTimeWithInterval();
	const [groupedTransactions, setGroupedTransactions] = useState<
		| Map<
				number,
				{
					buys: Transaction[];
					sells: Transaction[];
					kolAlerts?: KolAlert[];
					text?: string;
				}
		  >
		| undefined
	>();
	const askTokenTrade = useAskTokenTrade(meta.address);
	const transactionMarkers: ClickableMarker<Time>[] = useMemo(() => {
		// 找出 data 中最早和最晚的 unix 時間
		const earliestUnixTime = Math.min(...internal_data.map(item => item.unix));
		const latestUnixTime = Math.max(...internal_data.map(item => item.unix));

		const allTransactions: { type: 'buy' | 'sell'; transaction: Transaction }[] = [];

		// 處理買入交易
		if (internal_transactions?.buy_groups) {
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
		if (internal_transactions?.sell_groups) {
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
		const groupedTransactions = new Map<
			number,
			{
				buys: Transaction[];
				sells: Transaction[];
				kolAlerts?: KolAlert[];
				text?: string;
			}
		>();

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

		// 整合 kolAlerts 數據到 groupedTransactions 中
		if (kolAlerts) {
			kolAlerts.forEach(alert => {
				const alertTime = dayjs(alert.day).utc().unix();

				// 檢查 alert 是否在圖表時間範圍內
				if (alertTime < earliestUnixTime || alertTime > latestUnixTime) {
					return;
				}

				// 根據不同的時間間隔將 alert 分組到相應的 K 線蠟燭中
				let groupKey = alertTime;
				switch (query.type) {
					case IntervalFilter.OneMinute:
						groupKey = Math.floor(alertTime / 60) * 60;
						break;
					case IntervalFilter.FiveMinutes:
						groupKey = Math.floor(alertTime / (5 * 60)) * (5 * 60);
						break;
					case IntervalFilter.FifteenMinutes:
						groupKey = Math.floor(alertTime / (15 * 60)) * (15 * 60);
						break;
					case IntervalFilter.ThirtyMinutes:
						groupKey = Math.floor(alertTime / (30 * 60)) * (30 * 60);
						break;
					case IntervalFilter.OneHour:
						groupKey = Math.floor(alertTime / (60 * 60)) * (60 * 60);
						break;
					case IntervalFilter.FourHours:
						groupKey = Math.floor(alertTime / (4 * 60 * 60)) * (4 * 60 * 60);
						break;
					case IntervalFilter.OneDay:
						groupKey = Math.floor(alertTime / (24 * 60 * 60)) * (24 * 60 * 60);
						break;
					case IntervalFilter.OneWeek:
						groupKey = Math.floor(alertTime / (7 * 24 * 60 * 60)) * (7 * 24 * 60 * 60);
						break;
				}

				if (!groupedTransactions.has(groupKey)) {
					groupedTransactions.set(groupKey, { buys: [], sells: [], kolAlerts: [alert] });
				} else {
					const group = groupedTransactions.get(groupKey);
					if (!group) return;
					if (!group.kolAlerts) {
						group.kolAlerts = [alert];
					} else {
						group.kolAlerts.push(alert);
					}
				}
			});
		}

		// 將分組後的交易轉換為標記
		const markers: ClickableMarker<Time>[] = [];

		groupedTransactions.forEach((group, time) => {
			let totalBuy = 0;
			let totalSell = 0;
			let totalKolAlerts = 0;
			// 添加買入標記
			if (
				group.buys.length > 0 &&
				(searchParams.address.includes(Address.SmartMoney) || searchParams.address.includes(Address.Whale))
			) {
				const buyMin = searchParams.tmin;
				const buyMax = searchParams.tmax;

				const check = () => {
					if (buyMin == null && buyMax == null) {
						return true;
					}
					if (buyMin != null && buyMax != null) {
						const filteredBuys = group.buys.filter(
							tx => Number(tx.usd_value) >= buyMin && Number(tx.usd_value) <= buyMax,
						);
						return filteredBuys.length > 0;
					}
					if (buyMin != null && buyMax == null) {
						const filteredBuys = group.buys.filter(tx => Number(tx.usd_value) >= buyMin);
						return filteredBuys.length > 0;
					}
					if (buyMin == null && buyMax != null) {
						const filteredBuys = group.buys.filter(tx => Number(tx.usd_value) <= buyMax);
						return filteredBuys.length > 0;
					}
					return false;
				};

				// 計算符合過濾條件的交易數量
				if (buyMin != null || buyMax != null) {
					totalBuy = group.buys.filter(tx => {
						const usdValue = Number(tx.usd_value);
						if (buyMin != null && buyMax != null) {
							return usdValue >= buyMin && usdValue <= buyMax;
						}
						if (buyMin != null && buyMax == null) {
							return usdValue >= buyMin;
						}
						if (buyMin == null && buyMax != null) {
							return usdValue <= buyMax;
						}
						return false;
					}).length;
				} else {
					totalBuy = group.buys.length;
				}

				if (check()) {
					markers.push({
						time: time as Time,
						position: 'aboveBar',
						color: twTheme.extend.colors.buy.DEFAULT,
						size: 1,
						type: 'buy',
					});
				}
			}

			// 添加賣出標記
			if (
				group.sells.length > 0 &&
				(searchParams.address.includes(Address.SmartMoney) || searchParams.address.includes(Address.Whale))
			) {
				markers.push({
					time: time as Time,
					position: 'aboveBar',
					color: twTheme.extend.colors.sell.DEFAULT,
					size: 1,
					type: 'sell',
				});
				totalSell = group.sells.length;
			}

			// 添加 kolAlerts 標記
			if (group.kolAlerts && group.kolAlerts.length > 0 && searchParams.order.includes(Order.KOL)) {
				totalKolAlerts = group.kolAlerts.length;
				const orderMin = searchParams.ocmin;
				const orderMax = searchParams.ocmax;

				const check = () => {
					if (orderMin == null && orderMax == null) {
						return true;
					}
					if (orderMin != null && orderMax != null) {
						return totalKolAlerts >= orderMin && totalKolAlerts <= orderMax;
					}
					if (orderMin == null && orderMax != null) {
						return totalKolAlerts <= orderMax;
					}
					if (orderMin != null && orderMax == null) {
						return totalKolAlerts >= orderMin;
					}
					return false;
				};

				if (check()) {
					markers.push({
						time: time as Time,
						position: 'aboveBar',
						color: 'rgba(255, 181, 34, 1)',
						size: 1,
						type: 'loudspeaker',
					});
				} else {
					totalKolAlerts = 0;
				}
			}

			const total = totalKolAlerts + totalBuy + totalSell;

			if (total > 0) {
				markers.push({
					time: time as Time,
					position: 'aboveBar',
					color: total > 100 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
					size: total > 100 ? 1.5 : 1,
					type: 'text',
					text: total > 100 ? `99+` : `+${total}`,
				});
			}
		});

		setGroupedTransactions(groupedTransactions);

		return markers.sort((a, b) => (a.time as number) - (b.time as number));
	}, [
		internal_data,
		internal_transactions?.buy_groups,
		internal_transactions?.sell_groups,
		kolAlerts,
		query.type,
		searchParams.address,
		searchParams.order,
		searchParams.tmin,
		searchParams.tmax,
		searchParams.ocmin,
		searchParams.ocmax,
	]);

	useEffect(() => {
		const chartApi = chart._api;
		const seriesApi = series._api;
		let clean: (() => void) | undefined;
		if (chartApi && seriesApi && searchParams.mark) {
			const seriesMarkers = createClickableMarkers<Time>(chartApi, seriesApi, transactionMarkers, {
				tooltipSize: {
					width: 220,
					height: 290,
				},
				onOpenTooltip(option) {
					const currentGroup = groupedTransactions?.get(option.marker.time as number);

					// 過濾條件
					const buyMin = searchParams.tmin;
					const buyMax = searchParams.tmax;

					// 過濾 buy 交易
					const filteredBuys =
						currentGroup?.buys.filter(tx => {
							const usdValue = Number(tx.usd_value);
							if (buyMin == null && buyMax == null) {
								return true;
							}
							if (buyMin != null && buyMax != null) {
								return usdValue >= buyMin && usdValue <= buyMax;
							}
							if (buyMin != null && buyMax == null) {
								return usdValue >= buyMin;
							}
							if (buyMin == null && buyMax != null) {
								return usdValue <= buyMax;
							}
							return false;
						}) || [];

					openTooltip({
						...option,
						tooltip: (
							<OrderPopover
								meta={{
									buy: filteredBuys.length,
									sell: currentGroup?.sells.length ?? 0,
									order: currentGroup?.kolAlerts?.length ?? 0,
								}}
								total={{
									buy: filteredBuys.reduce((acc, tx) => acc + Number(tx.usd_value), 0),
									sell: currentGroup?.sells.reduce((acc, tx) => acc + Number(tx.usd_value), 0) ?? 0,
									volume:
										filteredBuys.reduce((acc, tx) => acc + Number(tx.usd_value), 0) +
										(currentGroup?.sells.reduce((acc, tx) => acc + Number(tx.usd_value), 0) ?? 0),
								}}
								order={{
									total: currentGroup?.kolAlerts?.length ?? 0,
									success: 0,
								}}
								onClose={closeTooltip}
								{...askTokenTrade}
								onAskMore={ask => {
									askTokenTrade.onAskMore(
										ask,
										dayjs(option.marker.time as number).valueOf(),
										dayjs(generateTimeWithInterval(option.marker.time as number, query.type, 1, 'add')).valueOf(),
									);
									closeTooltip();
								}}
							/>
						),
					});
				},
				onCloseTooltip() {
					closeTooltip();
				},
				onClick(marker) {
					logger(['onClick', marker]);
				},
			});
			clean = seriesMarkers.detach;
		}

		return () => {
			if (!series.isDisposed()) {
				clean?.();
			}
		};
	}, [
		transactionMarkers,
		chart,
		series,
		searchParams.mark,
		openTooltip,
		closeTooltip,
		groupedTransactions,
		tAskMore,
		searchParams.tmin,
		searchParams.tmax,
		askTokenTrade,
		generateTimeWithInterval,
		query.type,
	]);

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
				if (data.length < 150) {
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
