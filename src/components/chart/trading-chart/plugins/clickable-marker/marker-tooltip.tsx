import { createContext, use, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { createStore } from 'zustand';
import { useStore } from 'zustand';

interface MarkerTooltipProps {
	tooltip: React.ReactNode;
	visible: boolean;
	position: { x: number; y: number };
	container: HTMLElement | null;
}

interface MarkerTooltipState extends MarkerTooltipProps {
	setTooltip: (tooltip: React.ReactNode) => void;
	setVisible: (visible: boolean) => void;
	setPosition: (position: { x: number; y: number }) => void;
	setContainer: (container: HTMLElement | null) => void;
	openTooltip: (options: {
		tooltip: React.ReactNode;
		position: { x: number; y: number };
		container: HTMLElement | null;
	}) => void;
	closeTooltip: () => void;
}

type MarkerTooltipStore = ReturnType<typeof createMarkerTooltipStore>;

export const createMarkerTooltipStore = (initProps?: Partial<MarkerTooltipProps>) =>
	createStore<MarkerTooltipState>(set => ({
		tooltip: null,
		visible: false,
		position: { x: 0, y: 0 },
		container: null,
		...initProps,
		setTooltip: tooltip => set({ tooltip }),
		setVisible: visible => set({ visible }),
		setPosition: position => set({ position }),
		setContainer: container => set({ container }),
		openTooltip: options =>
			set({
				...options,
				visible: true,
			}),
		closeTooltip: () => set({ visible: false }),
	}));

export const MarkerTooltipContext = createContext<MarkerTooltipStore | null>(null);

type MarkerTooltipProviderProps = React.PropsWithChildren<Partial<MarkerTooltipProps>>;

export const MarkerTooltipProvider = (props?: MarkerTooltipProviderProps) => {
	const storeRef = useRef<MarkerTooltipStore | null>(null);
	if (!storeRef.current) {
		storeRef.current = createMarkerTooltipStore(props);
	}
	return <MarkerTooltipContext value={storeRef.current}>{props?.children}</MarkerTooltipContext>;
};

export const useMarkerTooltipStore = <T,>(selector: (store: MarkerTooltipState) => T): T => {
	const store = use(MarkerTooltipContext);
	if (!store) {
		throw new Error('useMarkerTooltip must be used within a MarkerTooltipProvider');
	}
	return useStore(store, selector);
};

export function positionTooltip(tooltipElement: HTMLElement, x: number, y: number, chartContainer: HTMLElement): void {
	// 獲取容器邊界
	const containerRect = chartContainer.getBoundingClientRect();

	// 計算預期位置
	let left = x;
	let top = y - tooltipElement.offsetHeight - 8; // 在點上方顯示，增加間距

	// 確保彈出窗口不超出容器
	if (left + tooltipElement.offsetWidth > containerRect.width) {
		left = x - tooltipElement.offsetWidth;
	}

	if (top < 0) {
		// 如果頂部超出，顯示在點下方
		top = y + 8;
	}

	// 設置位置
	tooltipElement.style.left = `${left}px`;
	tooltipElement.style.top = `${top}px`;
}

export const MarkerTooltip = () => {
	const { tooltip, visible, position, container } = useMarkerTooltipStore(store => store);

	const tooltipRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (tooltipRef.current && container) {
			positionTooltip(tooltipRef.current, position.x, position.y, container);
		}
	}, [position, container]);

	return (
		visible &&
		createPortal(
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				ref={tooltipRef}
				className="absolute z-[1000] bg-[#1C2633] rounded-sm p-2"
				style={{ left: position.x, top: position.y }}
			>
				{tooltip}
			</motion.div>,
			container ?? document.body,
		)
	);
};
