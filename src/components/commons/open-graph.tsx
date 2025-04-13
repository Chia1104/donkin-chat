import type { FC, CSSProperties } from 'react';

interface Props {
	metadata?: {
		title?: string | null;
		excerpt?: string | null;
		subtitle?: string | null;
	};
	styles?: {
		backgroundImage?: string;
		filter?: CSSProperties;
		title?: CSSProperties;
		excerpt?: CSSProperties;
		subtitle?: CSSProperties;
	};
}

// million-ignore
const OG: FC<Props> = ({ metadata, styles }) => {
	const titleStyle =
		styles?.title?.color === 'transparent'
			? {
					backgroundImage: styles?.title?.backgroundImage ?? 'linear-gradient(90deg, #35E4FF, #47A2FF)',
					backgroundClip: styles?.title?.backgroundClip ?? 'text',
					'-webkit-background-clip': 'text',
					color: 'transparent',
					...styles?.title,
				}
			: {
					color: styles?.title?.color ?? 'rgba(255, 255, 255, 1)',
					...styles?.title,
				};
	return (
		<div
			style={{
				display: 'flex',
				height: '100%',
				width: '100%',
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
				flexDirection: 'column',
				backgroundImage: styles?.backgroundImage ?? 'linear-gradient(180deg, #09182A 0%, #0F1319 100%)',
				textAlign: 'start',
				position: 'relative',
				zIndex: -2,
			}}
		>
			<div
				style={{
					height: '20px',
					top: 0,
					left: 0,
					width: '100%',
					backgroundImage: 'linear-gradient(90deg, #35E4FF, #47A2FF)',
					position: 'absolute',
					zIndex: 2,
				}}
			/>
			{styles?.filter && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backdropFilter: styles.filter?.backdropFilter ?? 'blur(4px)',
						backgroundColor: styles.filter?.backgroundColor ?? 'black',
						opacity: styles.filter?.opacity ?? 0.1,
						zIndex: 1,
						...styles.filter,
					}}
				/>
			)}
			<h1
				style={{
					fontSize: styles?.title?.fontSize ?? 60,
					fontWeight: 900,
					marginLeft: 80,
					marginRight: 80,
					lineHeight: 1.1,
					...titleStyle,
				}}
			>
				<b>{metadata?.title?.slice(0, 50)}</b>
			</h1>
			<p
				style={{
					fontSize: 30,
					color: 'rgba(255, 255, 255, 0.65)',
					marginLeft: 80,
					marginRight: 80,
					...styles?.excerpt,
				}}
			>
				{metadata?.excerpt?.slice(0, 100)}
			</p>
			<p
				style={{
					fontSize: 20,
					color: 'rgba(255, 255, 255, 0.65)',
					marginLeft: 80,
					marginRight: 80,
					marginBottom: 80,
					...styles?.subtitle,
				}}
			>
				{metadata?.subtitle}
			</p>
		</div>
	);
};

export default OG;
