'use client';

import { useState } from 'react';
import type { FC } from 'react';

import { DonkinLoading } from '@/components/commons/donkin/loading';

const LoadingExamplesPage: FC = () => {
	const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

	const backgrounds = [
		{ name: '白色', value: '#ffffff', textColor: 'text-black' },
		{ name: '黑色', value: '#000000', textColor: 'text-white' },
		{ name: '深藍', value: '#0f172a', textColor: 'text-white' },
		{ name: '淺灰', value: '#f1f5f9', textColor: 'text-black' },
	];

	return (
		<div className="container mx-auto py-12">
			<h1 className="text-3xl font-bold mb-8 text-center">Donkin Loading 動畫範例</h1>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">背景顏色選擇</h2>
				<div className="flex gap-4 flex-wrap">
					{backgrounds.map(bg => (
						<button
							key={bg.value}
							className={`px-4 py-2 rounded-md ${bg.textColor} transition-all`}
							style={{
								backgroundColor: bg.value,
								border: backgroundColor === bg.value ? '2px solid #35E4FF' : '2px solid transparent',
							}}
							onClick={() => setBackgroundColor(bg.value)}
						>
							{bg.name}
						</button>
					))}
				</div>
			</div>

			<div className="rounded-lg p-10 transition-all" style={{ backgroundColor }}>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* 小尺寸 */}
					<div
						className={`flex flex-col items-center ${backgroundColor === '#ffffff' || backgroundColor === '#f1f5f9' ? 'text-black' : 'text-white'}`}
					>
						<DonkinLoading size="sm" className="mb-4" />
						<p>小尺寸 (sm)</p>
					</div>

					{/* 中尺寸 */}
					<div
						className={`flex flex-col items-center ${backgroundColor === '#ffffff' || backgroundColor === '#f1f5f9' ? 'text-black' : 'text-white'}`}
					>
						<DonkinLoading size="md" className="mb-4" />
						<p>中尺寸 (md - 預設)</p>
					</div>

					{/* 大尺寸 */}
					<div
						className={`flex flex-col items-center ${backgroundColor === '#ffffff' || backgroundColor === '#f1f5f9' ? 'text-black' : 'text-white'}`}
					>
						<DonkinLoading size="lg" className="mb-4" />
						<p>大尺寸 (lg)</p>
					</div>
				</div>
			</div>

			<div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* 用法示例 */}
				<div className="bg-default-100 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
					<DonkinLoading className="mb-3" />
					<h3 className="font-medium">加載中...</h3>
				</div>

				<div className="bg-gray-900 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
					<DonkinLoading className="mb-3" />
					<h3 className="font-medium">資料處理中...</h3>
				</div>

				<div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
					<DonkinLoading className="mb-3" />
					<h3 className="font-medium">請稍候...</h3>
				</div>

				<div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center">
					<DonkinLoading size="lg" className="mb-3" />
					<h3 className="font-medium">上傳處理中...</h3>
				</div>
			</div>

			<div className="mt-16">
				<h2 className="text-xl font-semibold mb-4">使用說明</h2>
				<pre className="bg-default-100 p-4 rounded-lg overflow-x-auto">
					{`// 在组件中使用
import { DonkinLoading } from '@/components/ui/loading';

// 默認尺寸 (md)
<DonkinLoading />

// 小尺寸
<DonkinLoading size="sm" />

// 大尺寸
<DonkinLoading size="lg" />

// 自定義類名
<DonkinLoading className="my-custom-class" />`}
				</pre>
			</div>
		</div>
	);
};

export default LoadingExamplesPage;
