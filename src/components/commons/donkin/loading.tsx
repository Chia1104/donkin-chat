'use client';

import { useRef, useEffect } from 'react';

import { cn } from '@/utils/cn';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: 'sm' | 'md' | 'lg';
}

// 定義軌道參數類型
interface OrbitParams {
	initialRotation: number;
	tiltX: number;
	tiltY: number;
	rotationSpeed: number;
	radiusFactor: number;
	ellipseFactor: number;
}

// 定義 3D 點類型
interface Point3D {
	x: number;
	y: number;
	z: number;
}

const DonkinLoading = ({ className, size = 'md', ...props }: LoadingProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);

	const sizeMap = {
		sm: { width: 24, height: 24 },
		md: { width: 36, height: 36 },
		lg: { width: 48, height: 48 },
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 獲取畫布尺寸
		const { width, height } = sizeMap[size];

		// 設置實際畫布大小（考慮高 DPI 屏幕）
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.scale(dpr, dpr);

		// 中心點和基本球體半徑
		const center = { x: width / 2, y: height / 2 };
		const baseRadius = width * 0.35;

		// 軌道數量
		const numOrbits = 4;

		// 每個軌道的定義參數
		const orbits: OrbitParams[] = [];
		for (let i = 0; i < numOrbits; i++) {
			orbits.push({
				// 初始旋轉角度均勻分布
				initialRotation: (i / numOrbits) * Math.PI * 2,
				// 旋轉軸傾斜角度
				tiltX: Math.PI * 0.15 + (i * Math.PI * 0.5) / numOrbits,
				tiltY: Math.PI * 0.1 + (i * Math.PI * 0.25) / numOrbits,
				// 旋轉速度
				rotationSpeed: 0.01 + i * 0.005,
				// 半徑係數 (略微不同的大小)
				radiusFactor: 0.95 + (i * 0.05) / numOrbits,
				// 橢圓係數
				ellipseFactor: 0.9 + i * 0.05,
			});
		}

		// 全局旋轉角度
		let globalRotationX = 0;
		let globalRotationY = 0;
		let globalRotationZ = 0;

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			// 更新全局旋轉
			globalRotationX += 0.005;
			globalRotationY += 0.003;
			globalRotationZ += 0.002;

			// 繪製軌道
			orbits.forEach(orbit => {
				const { initialRotation, tiltX, tiltY, rotationSpeed, radiusFactor, ellipseFactor } = orbit;

				// 當前旋轉角度
				const rotation = initialRotation + performance.now() * 0.001 * rotationSpeed;

				// 計算軌道點
				const points: Point3D[] = [];
				const numPoints = 40; // 增加點數讓線條更平滑

				for (let i = 0; i <= numPoints; i++) {
					const angle = (i / numPoints) * Math.PI * 2;
					const pointAngle = angle + rotation;

					// 橢圓基本形狀
					const rx = Math.cos(pointAngle) * baseRadius * radiusFactor;
					const ry = Math.sin(pointAngle) * baseRadius * radiusFactor * ellipseFactor;
					const rz = 0;

					// 應用軌道傾斜
					const tiltedX = rx;
					const tiltedY = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
					const tiltedZ = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);

					const tiltedX2 = tiltedX * Math.cos(tiltY) + tiltedZ * Math.sin(tiltY);
					const tiltedY2 = tiltedY;
					const tiltedZ2 = -tiltedX * Math.sin(tiltY) + tiltedZ * Math.cos(tiltY);

					// 應用全局旋轉
					// 繞 X 軸旋轉
					const rotX = tiltedX2;
					const rotY = tiltedY2 * Math.cos(globalRotationX) - tiltedZ2 * Math.sin(globalRotationX);
					const rotZ = tiltedY2 * Math.sin(globalRotationX) + tiltedZ2 * Math.cos(globalRotationX);

					// 繞 Y 軸旋轉
					const rotX2 = rotX * Math.cos(globalRotationY) + rotZ * Math.sin(globalRotationY);
					const rotY2 = rotY;
					const rotZ2 = -rotX * Math.sin(globalRotationY) + rotZ * Math.cos(globalRotationY);

					// 繞 Z 軸旋轉
					const rotX3 = rotX2 * Math.cos(globalRotationZ) - rotY2 * Math.sin(globalRotationZ);
					const rotY3 = rotX2 * Math.sin(globalRotationZ) + rotY2 * Math.cos(globalRotationZ);
					const rotZ3 = rotZ2;

					// 投影到 2D 並移到中心
					const x = center.x + rotX3;
					const y = center.y + rotY3;
					const z = rotZ3;

					points.push({ x, y, z });
				}

				// 計算線條粗細 (根據 z 軸位置)
				const avgZ = points.reduce((sum, p) => sum + p.z, 0) / points.length;
				const normalizedZ = avgZ / (baseRadius * 0.5);
				const lineWidth = Math.max(1, 1.5 + normalizedZ * 0.5);
				const opacity = 0.7 + Math.min(0.3, Math.max(0, normalizedZ * 0.2));

				// 繪製軌道線條
				ctx.beginPath();
				points.forEach((point, index) => {
					if (index === 0) {
						ctx.moveTo(point.x, point.y);
					} else {
						ctx.lineTo(point.x, point.y);
					}
				});

				// 閉合路徑
				ctx.closePath();

				// 設置線條樣式
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = `rgba(53, 228, 255, ${opacity})`;
				ctx.stroke();
			});

			// 繼續動畫
			animationRef.current = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			// 清理動畫
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [size]);

	return (
		<div className={cn('relative flex items-center justify-center', className)} {...props}>
			<canvas
				ref={canvasRef}
				className={cn('block')}
				style={{
					width: `${sizeMap[size].width}px`,
					height: `${sizeMap[size].height}px`,
				}}
			/>
		</div>
	);
};

export { DonkinLoading };
