import Toast from '@/components/Toast'
import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'

export default function useToastError<ErrorType>(
  error: unknown,
  getMessage: (error: ErrorType) => string
) {
  const getMessageRef = useRef(getMessage)
  useEffect(() => {
    if (error) {
      let message: string | undefined = (error as any)?.message

      const response = (error as any)?.response?.data
      if (response) {
        const responseMessage = getMessageRef.current(response)
        if (responseMessage) message = responseMessage
      }

      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Sign up failed, please try again'
          description={message}
        />
      ))
    }
  }, [error])
}
