import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { mockCheckupConfig } from '@/mocks/checkup'

export type CheckupStatus = 'normal' | 'warning' | 'pending' | 'alerting'

interface CheckupState {
  status: CheckupStatus
  intervalHours: number
  warningMinutes: number
  responseTimeoutSec: number
  snoozeDurationMin: number
  timerStartedAt: number | null
  lastConfirmedAt: number | null
  cancelPassword: string
  preWarningMinutes: number
  finalAlertMinutes: number
  notificationsEnabled: boolean
  locationEnabled: boolean
  capsuleEnabled: boolean
  startTimer: () => void
  confirmOk: () => void
  triggerAlert: () => void
  snooze: () => void
  cancelAlert: (password: string) => boolean
  setInterval: (hours: number) => void
  setNotificationsEnabled: (v: boolean) => void
  setPreWarningMinutes: (m: number) => void
  setFinalAlertMinutes: (m: number) => void
  tick: () => void
}

export const useCheckupStore = create<CheckupState>()(
  persist(
    (set, get) => ({
      status: 'normal',
      intervalHours: mockCheckupConfig.intervalHours,
      warningMinutes: mockCheckupConfig.warningMinutes,
      responseTimeoutSec: mockCheckupConfig.responseTimeoutSec,
      snoozeDurationMin: mockCheckupConfig.snoozeDurationMin,
      timerStartedAt: Date.now(),
      lastConfirmedAt: null,
      cancelPassword: mockCheckupConfig.cancelPassword,
      preWarningMinutes: mockCheckupConfig.preWarningMinutes,
      finalAlertMinutes: mockCheckupConfig.finalAlertMinutes,
      notificationsEnabled: true,
      locationEnabled: true,
      capsuleEnabled: true,
      startTimer: () => set({ timerStartedAt: Date.now(), status: 'normal' }),
      confirmOk: () => set({ status: 'normal', timerStartedAt: Date.now(), lastConfirmedAt: Date.now() }),
      triggerAlert: () => set({ status: 'alerting' }),
      snooze: () => {
        const { snoozeDurationMin, intervalHours } = get()
        const fakeStart = Date.now() - (intervalHours * 3600 * 1000) + (snoozeDurationMin * 60 * 1000)
        set({ timerStartedAt: fakeStart, status: 'normal' })
      },
      cancelAlert: (password) => {
        if (password === get().cancelPassword) {
          set({ status: 'normal', timerStartedAt: Date.now() })
          return true
        }
        return false
      },
      setInterval: (hours) => set({ intervalHours: hours, timerStartedAt: Date.now(), status: 'normal' }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setPreWarningMinutes: (m) => set({ preWarningMinutes: m }),
      setFinalAlertMinutes: (m) => set({ finalAlertMinutes: m }),
      tick: () => {
        const { status, timerStartedAt, intervalHours, warningMinutes } = get()
        if (status === 'alerting' || status === 'pending' || timerStartedAt === null) return
        const elapsedMs = Date.now() - timerStartedAt
        const totalMs = intervalHours * 3600 * 1000
        const remainingMs = totalMs - elapsedMs
        const remainingMin = remainingMs / 60000
        if (remainingMs <= 0) {
          set({ status: 'pending' })
        } else if (remainingMin <= warningMinutes) {
          set({ status: 'warning' })
        } else {
          set({ status: 'normal' })
        }
      },
    }),
    { name: 'checkup-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)

export function getRemainingMs(store: CheckupState): number {
  if (!store.timerStartedAt) return store.intervalHours * 3600 * 1000
  const elapsed = Date.now() - store.timerStartedAt
  return Math.max(0, store.intervalHours * 3600 * 1000 - elapsed)
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
