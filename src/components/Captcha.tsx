import HCaptchaIcon from '@/assets/logo/hcaptcha.svg'
import { cx } from '@/utils/class-names'
import { getCaptchaSiteKey } from '@/utils/env/client'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ComponentProps, useRef, useState } from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5'

export type CaptchaProps = ComponentProps<'div'> & {
  onVerify: (token: string) => Promise<void> | void
}

const siteKey = getCaptchaSiteKey()

export default function Captcha({
  onVerify: _onVerify,
  ...props
}: CaptchaProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [clickedCaptcha, setClickedCaptcha] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const onExpire = () => {
    setClickedCaptcha(false)
    setToken('')
    setError('Captcha expired, please try again.')
  }

  const onError = () => {
    setClickedCaptcha(false)
    setToken('')
    setError('Captcha error, please try again.')
  }

  const onTriggerCaptcha = () => {
    setClickedCaptcha(true)
    captchaRef.current?.execute()
  }

  const onVerify = async (token: string) => {
    setToken(token)
    setClickedCaptcha(false)
    await _onVerify(token)

    captchaRef.current?.resetCaptcha()
  }

  return (
    <>
      <div {...props} className={cx('w-full', props.className)}>
        <div className='flex w-full items-center rounded-lg border border-background-lightest bg-background-light py-5 px-4 transition hover:brightness-105'>
          <div
            className={cx(
              'relative mr-3 flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-background-lightest',
              token && 'bg-background-primary'
            )}
            onClick={onTriggerCaptcha}
          >
            {clickedCaptcha && !token && (
              <div className='absolute inset-0 h-full w-full animate-pulse bg-background-lightest' />
            )}
            {token && <IoCheckmarkOutline className='text-2xl' />}
          </div>
          <span className=''>I&apos;m human</span>
          <HCaptchaIcon className='ml-auto text-4xl' />
        </div>
        {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
      </div>
      <HCaptcha
        size='invisible'
        theme='dark'
        onVerify={onVerify}
        onExpire={onExpire}
        sitekey={siteKey}
        onError={onError}
        ref={captchaRef}
      />
    </>
  )
}