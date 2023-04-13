import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { getEmojiAmount, isTextContainsOnlyEmoji } from '@/utils/text'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import RepliedMessagePreview from '../RepliedMessagePreview'
import { ChatItemContentProps } from './types'

export type EmojiChatItemProps = ChatItemContentProps

const EMOJI_FONT_SIZE = {
  min: 32,
  max: 80,
}
const MAX_EMOJI_AMOUNT = 3

export function shouldRenderEmojiChatItem(body: string) {
  return (
    isTextContainsOnlyEmoji(body) && getEmojiAmount(body) <= MAX_EMOJI_AMOUNT
  )
}

export default function EmojiChatItem({
  isMyMessage,
  isSent,
  onCheckMarkClick,
  body,
  ownerId,
  relativeTime,
  senderColor,
  inReplyTo,
  getRepliedElement,
  scrollContainer,
  ...props
}: EmojiChatItemProps) {
  const emojiCount = getEmojiAmount(body)

  const emojiDiff = EMOJI_FONT_SIZE.max - EMOJI_FONT_SIZE.min
  const emojiFontIncrement = emojiDiff / (MAX_EMOJI_AMOUNT - 1)
  const emojiFontSize =
    EMOJI_FONT_SIZE.min + emojiFontIncrement * (MAX_EMOJI_AMOUNT - emojiCount)

  return (
    <div
      className={cx(
        'flex flex-col gap-1',
        isMyMessage ? 'items-end' : 'items-start',
        props.className
      )}
    >
      <div
        className={cx('flex', isMyMessage ? 'flex-row-reverse' : 'flex-row')}
      >
        <p
          className={cx('flex items-center')}
          style={{
            fontSize: emojiFontSize,
          }}
        >
          {body}
        </p>
        <div
          className={cx(
            isMyMessage ? 'items-end' : 'items-start',
            'flex flex-col gap-4 py-2'
          )}
        >
          {inReplyTo && (
            <div className='rounded-xl bg-background-light py-2 px-2.5'>
              <RepliedMessagePreview
                originalMessage={body}
                repliedMessageId={inReplyTo.id}
                getRepliedElement={getRepliedElement}
                scrollContainer={scrollContainer}
              />
            </div>
          )}
        </div>
      </div>
      <div className='mt-auto flex items-center gap-1 rounded-2xl bg-background-light py-1.5 px-2.5'>
        <span className='text-xs text-text-muted'>{relativeTime}</span>
        <Button
          variant='transparent'
          size='noPadding'
          interactive='brightness-only'
          onClick={onCheckMarkClick}
        >
          {isSent ? (
            <IoCheckmarkDoneOutline className='text-sm' />
          ) : (
            <IoCheckmarkOutline className={cx('text-sm text-text-muted')} />
          )}
        </Button>
      </div>
    </div>
  )
}
