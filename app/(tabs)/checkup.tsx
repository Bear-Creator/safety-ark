import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Text, Button, Surface } from 'react-native-paper'
import { router } from 'expo-router'
import { useCheckupStore } from '@/store/checkupStore'
import { useShake } from '@/hooks/useShake'
import { Colors } from '@/theme/theme'

export default function CheckupScreen() {
  const store = useCheckupStore()
  const [timeLeft, setTimeLeft] = useState(store.responseTimeoutSec)
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    )
    anim.start()
    return () => anim.stop()
  }, [pulse])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          store.triggerAlert()
          router.replace('/fail')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const handleConfirm = useCallback(() => {
    store.confirmOk()
    router.replace('/(tabs)/')
  }, [])

  const { isAvailable, simulateShake } = useShake(handleConfirm)

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.ring, { transform: [{ scale: pulse }] }]}>
        <View style={styles.innerRing}>
          <Text style={styles.ringIcon}>⚡</Text>
        </View>
      </Animated.View>

      <Text variant="headlineSmall" style={styles.title}>ВЫ В ПОРЯДКЕ?</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Подтвердите активность</Text>

      <Surface style={styles.timerBox} elevation={0}>
        <Text variant="labelMedium" style={styles.timerLabel}>АВТООТВЕТ ЧЕРЕЗ</Text>
        <Text style={styles.timerValue}>{timeLeft}с</Text>
      </Surface>

      <Button mode="contained" onPress={handleConfirm} style={styles.okBtn} contentStyle={{ paddingVertical: 10 }} buttonColor={Colors.safe}>
        ✓ Я в норме!
      </Button>

      {isAvailable ? (
        <Text variant="bodySmall" style={styles.hint}>Или просто потрясите телефон</Text>
      ) : (
        <Button mode="outlined" onPress={simulateShake} style={styles.shakeBtn} textColor={Colors.text2}>
          🤳 Имитировать тряску
        </Button>
      )}

      <Button mode="text" onPress={() => { store.snooze(); router.replace('/(tabs)/') }} style={{ marginTop: 8 }} textColor={Colors.text3}>
        Напомнить через 5 мин
      </Button>
      <Button mode="text" onPress={() => { store.triggerAlert(); router.replace('/fail') }} textColor={Colors.accent}>
        Нужна помощь
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffeaea', justifyContent: 'center', alignItems: 'center', padding: 24 },
  ring: { width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(230,57,70,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  innerRing: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  ringIcon: { fontSize: 48 },
  title: { color: Colors.text, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  subtitle: { color: Colors.text2, marginBottom: 16 },
  timerBox: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 24, minWidth: 120 },
  timerLabel: { color: Colors.text3, letterSpacing: 1 },
  timerValue: { fontSize: 40, fontWeight: '700', color: Colors.accent },
  okBtn: { borderRadius: 14, minWidth: 220, marginBottom: 12 },
  shakeBtn: { borderRadius: 12, marginTop: 4 },
  hint: { color: Colors.text3, marginTop: 4 },
})
