'use client'
import { useAuth } from './appContext'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function useAnalytics() {
  const { userId, role } = useAuth()

  function track(eventName: string, params?: Record<string, unknown>) {
    window.gtag?.('event', eventName, {
      user_id: userId,
      user_role: role,
      ...params,
    })
  }

  return { track }
}
