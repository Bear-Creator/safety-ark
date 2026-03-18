import React, { useEffect, useState, useMemo, useRef } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper'
import { router } from 'expo-router'
import { useCheckupStore, getRemainingMs, formatTime } from '@/store/checkupStore'
import { StatusCard } from '@/components/StatusCard'
import { SectionTitle } from '@/components/SectionTitle'
import { Colors } from '@/theme/theme'
import { mockCheckupHistory } from '@/mocks/checkup'
import { haptics } from '@/utils/haptics'

export default function HomeScreen() {
  const store = useCheckupStore()
  const [, forceUpdate] = useState(0)
  const prevStatusRef = useRef(store.status)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
    const id = setInterval(() => {
      store.tick()
      forceUpdate((n) => n + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const current = store.status
    const prev = prevStatusRef.current
    if (prev !== current) {
      if (current === 'warning') haptics.warning()
      if (current === 'pending') haptics.error()
      prevStatusRef.current = current
    }
  }, [store.status])

  const remainingMs = useMemo(() => getRemainingMs(store), [store.timerStartedAt, store.status])
  const timeStr = formatTime(remainingMs)

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>
  }

  const isAlert = store.status === 'alerting'

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>SafetyArk</Text>
      <StatusCard status={store.status} />

      <Surface style={[styles.timerCard, isAlert && styles.timerCardAlert]} elevation={2}>
        <Text variant="labelLarge" style={styles.timerLabel}>
          {isAlert ? 'ТРЕВОГА АКТИВНА' : 'СЛЕДУЮЩИЙ ЧЕК-АП ЧЕРЕЗ'}
        </Text>
        <Text style={[styles.timerValue, { color: isAlert ? Colors.accent : timerColor(store.status) }]}>
          {isAlert ? '⚡' : timeStr}
        </Text>
        {!isAlert ? (
          <Button mode="contained" onPress={store.confirmOk} style={styles.confirmBtn} buttonColor={Colors.safe}>
            ✓ Я в норме
          </Button>
        ) : (
          <Button mode="contained" onPress={() => router.push('/fail')} style={styles.confirmBtn} buttonColor={Colors.accent}>
            Перейти к тревоге
          </Button>
        )}
      </Surface>

      <SectionTitle title="Быстрые действия" />
      <View style={styles.actions}>
        <ActionBtn emoji="⚡" label="Чек-ап" onPress={() => router.push('/(tabs)/checkup')} color={Colors.accent} />
        <ActionBtn emoji="👥" label="Контакты" onPress={() => router.push('/contacts')} color={Colors.safe} />
        <ActionBtn emoji="📋" label="Мои данные" onPress={() => router.push('/data')} color={Colors.warn} />
        <ActionBtn emoji="⚙️" label="Параметры" onPress={() => router.push('/(tabs)/settings')} color={Colors.text2} />
      </View>

      <SectionTitle title="История чек-апов" />
      {mockCheckupHistory.slice(0, 5).map((h, i) => (
        <Surface key={i} style={styles.historyRow} elevation={0}>
          <Text style={styles.historyDate}>{h.date}</Text>
          <Text style={{ color: h.status === 'ok' ? Colors.safe : Colors.accent, fontWeight: '600' }}>
            {h.status === 'ok' ? `✓ ${h.respondedAt}` : '✗ Пропущен'}
          </Text>
        </Surface>
      ))}
    </ScrollView>
  )
}

function timerColor(status: string) {
  if (status === 'warning') return Colors.warn
  if (status === 'pending') return Colors.accent
  return Colors.safe
}

function ActionBtn({ emoji, label, onPress, color }: { emoji: string; label: string; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={styles.actionBtn} elevation={1}>
        <Text style={styles.actionEmoji}>{emoji}</Text>
        <Text variant="labelSmall" style={[styles.actionLabel, { color }]}>{label}</Text>
      </Surface>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: Colors.text, fontWeight: '700', marginBottom: 16 },
  timerCard: { borderRadius: 20, padding: 24, alignItems: 'center', backgroundColor: Colors.surface, marginBottom: 8 },
  timerCardAlert: { backgroundColor: '#ffeaea' },
  timerLabel: { color: Colors.text3, letterSpacing: 1, marginBottom: 8 },
  timerValue: { fontSize: 48, fontWeight: '700', marginBottom: 16 },
  confirmBtn: { borderRadius: 12, minWidth: 180 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  actionBtn: { width: 155, borderRadius: 16, padding: 16, alignItems: 'center', backgroundColor: Colors.surface },
  actionEmoji: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontWeight: '700' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 10, marginBottom: 4, backgroundColor: Colors.surface },
  historyDate: { color: Colors.text2 },
})
