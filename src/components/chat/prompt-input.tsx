import { memo } from 'react';

import type { FormProps } from '@heroui/form';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';
import type { TextAreaProps } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { useTranslations } from 'next-intl';

import { useChatStore } from '@/stores/chat';
import { cn } from '@/utils/cn';

import { HeroButton } from '../ui/hero-button';

export interface Props {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	props?: {
		form?: FormProps;
		textarea?: TextAreaProps;
	};
}

const PromptInput = memo(
	({ onSubmit, value, onChange, props }: Props) => {
		const t = useTranslations('chat');
		const enabled = useChatStore(state => state.enabled);
		return (
			<Form
				aria-label="Prompt Form"
				{...props?.form}
				className={cn('w-full', props?.form?.className)}
				onSubmit={onSubmit}
			>
				<Textarea
					isDisabled={!enabled}
					aria-label="Prompt"
					minRows={4}
					maxRows={4}
					placeholder={t('prompt-placeholder')}
					radius="sm"
					variant="underlined"
					endContent={
						<>
							<HeroButton
								aria-label="Send"
								radius="full"
								size="sm"
								isIconOnly
								variant="light"
								type="submit"
								className="self-end"
							>
								<Image src="/assets/images/send.svg" width={24} height={24} />
							</HeroButton>
						</>
					}
					{...props?.textarea}
					className={cn('min-h-[60px] w-full', props?.textarea?.className)}
					classNames={{
						label: ['hidden', props?.textarea?.classNames?.label],
						input: [
							'py-0 text-medium data-[has-start-content=true]:ps-0 data-[has-start-content=true]:pe-0 text-sm',
							props?.textarea?.classNames?.input,
						],
						innerWrapper: ['items-center px-3 py-2', props?.textarea?.classNames?.innerWrapper],
						inputWrapper: [
							'min-h-[60px] border-1 !rounded-lg bg-black/25 bg-transparent after:bg-gradient-to-r after:from-transparent after:via-primary/50 after:to-transparent after:bg-transparent ',
							props?.textarea?.classNames?.inputWrapper,
						],
					}}
					value={value}
					onChange={onChange}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
							e.preventDefault();
							onSubmit(e as React.FormEvent<HTMLFormElement>);
						}
					}}
				/>
			</Form>
		);
	},
	(prevProps, nextProps) => prevProps.value === nextProps.value,
);

export default PromptInput;
