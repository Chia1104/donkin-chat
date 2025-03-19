/**
 * 創建彈出窗口元素
 */
export function createTooltip(): HTMLElement {
	const tooltipElement = document.createElement('div');

	// 設置基本樣式
	tooltipElement.style.position = 'absolute';
	tooltipElement.style.display = 'none';
	tooltipElement.style.padding = '12px';
	tooltipElement.style.backgroundColor = 'rgba(38, 43, 77, 0.95)';
	tooltipElement.style.color = 'white';
	tooltipElement.style.borderRadius = '8px';
	tooltipElement.style.fontSize = '14px';
	tooltipElement.style.zIndex = '1000';
	tooltipElement.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
	tooltipElement.style.transition = 'opacity 0.2s ease-in-out';
	tooltipElement.style.maxWidth = '280px';
	tooltipElement.style.width = 'auto';
	tooltipElement.style.pointerEvents = 'none'; // 讓滑鼠事件穿透

	return tooltipElement;
}

export interface TooltipContent {
	title?: string;
	content?: string;
	image?: string;
	date?: string;
	price?: string;
}

/**
 * 更新彈出窗口內容
 */
export function updateTooltipContent(tooltipElement: HTMLElement, content: TooltipContent): void {
	// 清除現有內容
	tooltipElement.innerHTML = '';

	// 創建內容容器
	const contentContainer = document.createElement('div');
	contentContainer.style.display = 'flex';
	contentContainer.style.flexDirection = 'column';
	contentContainer.style.gap = '8px';

	// 添加標題
	if (content.title) {
		const titleElement = document.createElement('div');
		titleElement.textContent = content.title;
		titleElement.style.fontWeight = 'bold';
		titleElement.style.fontSize = '16px';
		titleElement.style.marginBottom = '4px';
		contentContainer.appendChild(titleElement);
	}

	// 添加日期和價格信息
	if (content.date || content.price) {
		const metaContainer = document.createElement('div');
		metaContainer.style.display = 'flex';
		metaContainer.style.justifyContent = 'space-between';
		metaContainer.style.fontSize = '12px';
		metaContainer.style.color = 'rgba(255, 255, 255, 0.8)';

		if (content.date) {
			const dateElement = document.createElement('div');
			dateElement.textContent = content.date;
			metaContainer.appendChild(dateElement);
		}

		if (content.price) {
			const priceElement = document.createElement('div');
			priceElement.textContent = content.price;
			priceElement.style.fontWeight = 'bold';
			metaContainer.appendChild(priceElement);
		}

		contentContainer.appendChild(metaContainer);
	}

	// 添加圖片
	if (content.image) {
		const imageElement = document.createElement('img');
		imageElement.src = content.image;
		imageElement.style.width = '100%';
		imageElement.style.borderRadius = '4px';
		imageElement.style.marginTop = '8px';
		imageElement.style.maxHeight = '120px';
		imageElement.style.objectFit = 'cover';
		contentContainer.appendChild(imageElement);
	}

	// 添加內容文本
	if (content.content) {
		const textElement = document.createElement('div');
		textElement.textContent = content.content;
		textElement.style.lineHeight = '1.4';
		contentContainer.appendChild(textElement);
	}

	// 添加到彈出窗口
	tooltipElement.appendChild(contentContainer);
}

/**
 * 設置彈出窗口位置
 */
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
