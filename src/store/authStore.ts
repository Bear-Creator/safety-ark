import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { mockUser } from '@/mocks/user'

interface AuthState {
  isAuthenticated: boolean
  onboardingDone: boolean
  user: typeof mockUser | null
  login: (email: string, password: string) => boolean
  completeRegistration: (data: Partial<typeof mockUser>) => void
  setOnboardingDone: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      onboardingDone: false,
      user: null,
      login: (email, password) => {
        if (!email.trim() || !password.trim()) return false
        set({ isAuthenticated: true, onboardingDone: true, user: { ...mockUser, email } })
        return true
      },
      completeRegistration: (data) => {
        set({ isAuthenticated: true, user: { ...mockUser, ...data } })
      },
      setOnboardingDone: () => set({ onboardingDone: true }),
      logout: () => set({ isAuthenticated: false, onboardingDone: false, user: null }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)
