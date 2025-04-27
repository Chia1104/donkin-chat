'use client';

import { memo } from 'react';

import rehypeShiki from '@shikijs/rehype';
import dynamic from 'next/dynamic';
import type { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

import { Link as SafeLink } from '@/components/ui/link';

const ReactMarkdownHooks = dynamic(() => import('react-markdown').then(mod => mod.MarkdownHooks), { ssr: false });

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const remarkPlugins: PluggableList = [[remarkGfm]];
const rehypePluginsWithShiki: PluggableList = [
	[
		rehypeShiki,
		{
			theme: 'one-dark-pro',
		},
	],
	[rehypeRaw],
];
const rehypePluginsWithoutShiki: PluggableList = [[rehypeSanitize], [rehypeRaw], [rehypeKatex]];

const components: Components = {
	// @ts-expect-error - error
	a: props => <SafeLink {...props} withSafeLink />,
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
