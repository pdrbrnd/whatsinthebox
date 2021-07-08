import { useCallback, useEffect, useState } from 'react'

const ABOUT_MODAL_KEY = '__witb_returning__'
export const useAboutModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const returningUser = localStorage.getItem(ABOUT_MODAL_KEY)
    if (!returningUser) {
      setIsOpen(true)
    }
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem(ABOUT_MODAL_KEY, '1')
  }, [])

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  return { isOpen, onClose, onOpen }
}
