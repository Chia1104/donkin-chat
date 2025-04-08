'use client';

import { memo } from 'react';

import { Link } from '@heroui/link';
import rehypeShiki from '@shikijs/rehype';
import dynamic from 'next/dynamic';
import type { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { PluggableList } from 'unified';

const ReactMarkdownHooks = dynamic(() => import('react-markdown').then(mod => mod.MarkdownHooks), { ssr: false });

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const remarkPlugins: PluggableList = [[remarkGfm], [remarkMath]];
const rehypePluginsWithShiki: PluggableList = [
	[
		rehypeShiki,
		{
			theme: 'one-dark-pro',
		},
	],
	[rehypeRaw],
	[rehypeKatex],
];
const rehypePluginsWithoutShiki: PluggableList = [[rehypeSanitize], [rehypeRaw], [rehypeKatex]];

const components: Components = {
	a: ({ children, ...props }) => {
		return (
			// @ts-expect-error - error
			<Link {...props} underline="always" color="primary" size="sm" target="_blank" rel="noopener noreferrer">
				{children}
			</Link>
		);
	},
};

interface Props {
	content: string;
	experimental?: {
		shiki?: boolean;
	};
}

const Markdown = (props: Props) => {
	return props.experimental?.shiki ? (
		<ReactMarkdownHooks remarkPlugins={remarkPlugins} rehypePlugins={rehypePluginsWithShiki} components={components}>
			{props.content}
		</ReactMarkdownHooks>
	) : (
		<ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePluginsWithoutShiki} components={components}>
			{props.content}
		</ReactMarkdown>
	);
};

export default memo(Markdown, (prevProps, nextProps) => {
	return prevProps.content === nextProps.content && prevProps.experimental?.shiki === nextProps.experimental?.shiki;
});
