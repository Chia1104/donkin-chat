import { useCallback, useEffect, useRef, useState } from 'react';

import type { ButtonProps } from '@heroui/button';
import { Button } from '@heroui/button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';

import { cn } from '@/utils/cn';

interface AutoScrollProps<TContainer extends HTMLElement> extends ButtonProps {
	/**
	 * 是否正在進行流式回應
	 */
	streaming?: boolean;
	/**
	 * 容器的ref
	 */
	containerRef: React.RefObject<TContainer | null>;
	wrapperClassName?: string;
	wrapperMotionProps?: MotionProps;
}

export function AutoScroll<TContainer extends HTMLElement>({
	streaming = false,
	containerRef,
	...props
}: AutoScrollProps<TContainer>) {
	const isUserScrolling = useRef(false);
	const prevScrollTop = useRef(0);
	const prevScrollHeight = useRef(0);
	const [showButton, setShowButton] = useState(false);

	// 監聽用戶滾動行為
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			// 檢查是否為用戶主動滾動
			// 計算距離底部的距離
			const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

			// 如果用戶往上滾動，設置isUserScrolling為true
			if (container.scrollTop < prevScrollTop.current && distanceFromBottom > 30) {
				isUserScrolling.current = true;
				setShowButton(true);
			}

			// 如果用戶滾動到底部，重置isUserScrolling
			if (distanceFromBottom < 10) {
				isUserScrolling.current = false;
				setShowButton(false);
			}

			prevScrollTop.current = container.scrollTop;
		};

		container.addEventListener('scroll', handleScroll);
		return () => {
			container.removeEventListener('scroll', handleScroll);
		};
	}, [containerRef]);

	// 強制滾動到底部的函數
	const scrollToBottom = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		// 使用 requestAnimationFrame 確保在下一個繪製幀才執行滾動
		requestAnimationFrame(() => {
			if (!isUserScrolling.current || streaming) {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: 'smooth',
				});
			}
			prevScrollHeight.current = container.scrollHeight;
		});
	}, [containerRef, streaming]);

	const clickToScrollToBottom = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		container.scrollTo({
			top: container.scrollHeight,
			behavior: 'smooth',
		});
	}, [containerRef]);

	// 當 streaming 狀態變更時滾動到底部
	useEffect(() => {
		if (streaming) {
			scrollToBottom();
		}
	}, [scrollToBottom, streaming]);

	// 根據 streaming 狀態自動滾動到底部
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 初始化時滾動到底部
		scrollToBottom();

		// 建立 MutationObserver 監視內容變化
		const observer = new MutationObserver(() => {
			if (streaming && !isUserScrolling.current) {
				scrollToBottom();
			}
		});

		observer.observe(container, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			observer.disconnect();
		};
	}, [containerRef, scrollToBottom, streaming]);

	// 初始渲染後立即滾動到底部
	useEffect(() => {
		scrollToBottom();

		// 確保在初始內容載入後也滾動到底部
		const timeoutId = setTimeout(scrollToBottom, 100);
		return () => clearTimeout(timeoutId);
	}, [scrollToBottom]);

	return (
		<AnimatePresence>
			{showButton && (
				<motion.span
					initial={{ opacity: 0, scale: 0, x: '-50%', y: 20 }}
					animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
					exit={{ opacity: 0, scale: 0, x: '-50%', y: 20 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					layout
					{...props.wrapperMotionProps}
					className={props.wrapperClassName}
				>
					<Button
						isIconOnly
						radius="full"
						size="sm"
						{...props}
						onPress={clickToScrollToBottom}
						className={cn('w-8 min-w-8 h-8 min-h-8', props.className)}
					>
						<ArrowDownwardIcon
							sx={{
								width: '16px',
								height: '16px',
							}}
						/>
					</Button>
				</motion.span>
			)}
		</AnimatePresence>
	);
}
