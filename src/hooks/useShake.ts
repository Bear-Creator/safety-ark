import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { Accelerometer } from 'expo-sensors'

const SHAKE_THRESHOLD = 1.5
const COOLDOWN_MS = 2000

export function useShake(onShake: () => void): {
  isAvailable: boolean
  simulateShake: () => void
} {
  const lastShakeAt = useRef(0)
  const isWeb = Platform.OS === 'web'

  useEffect(() => {
    if (isWeb) return
    Accelerometer.setUpdateInterval(100)
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z)
      const now = Date.now()
      if (magnitude > SHAKE_THRESHOLD && now - lastShakeAt.current > COOLDOWN_MS) {
        lastShakeAt.current = now
        onShake()
      }
    })
    return () => sub.remove()
  }, [onShake, isWeb])

  return { isAvailable: !isWeb, simulateShake: onShake }
}
