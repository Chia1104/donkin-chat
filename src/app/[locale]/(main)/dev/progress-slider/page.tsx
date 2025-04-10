'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';

import { ProgressSlider } from '@/components/ui/progress-slider';

export default function ProgressSliderExample() {
	return (
		<div className="p-4 max-w-4xl mx-auto space-y-8">
			<h1 className="text-2xl font-bold">Progress Slider 示例</h1>

			<Card className="p-4">
				<CardHeader>
					<h2 className="text-xl font-semibold">基本用法</h2>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 gap-6">
						<div className="space-y-2">
							<p className="text-sm text-foreground-500">默認設置</p>
							<ProgressSlider value={50} />
						</div>

						<div className="space-y-2">
							<p className="text-sm text-foreground-500">不同區間數量</p>
							<ProgressSlider value={70} segments={5} />
							<ProgressSlider value={70} segments={10} className="mt-4" />
							<ProgressSlider value={70} segments={15} className="mt-4" />
						</div>

						<div className="space-y-2">
							<p className="text-sm text-foreground-500">自訂樣式</p>
							<ProgressSlider
								value={60}
								segments={10}
								classNames={{
									segment: 'h-3 rounded-none',
									activeSegment: 'bg-primary',
								}}
							/>
						</div>

						<div className="space-y-2">
							<p className="text-sm text-foreground-500">顯示進度值</p>
							<ProgressSlider value={85} showValue />
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
