import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Surface, Text } from 'react-native-paper'
import { Colors } from '@/theme/theme'

type Status = 'normal' | 'warning' | 'pending' | 'alerting'

const statusConfig: Record<Status, { color: string; label: string; bg: string }> = {
  normal:   { color: Colors.safe,   label: 'СТАТУС: БЕЗОПАСНО',      bg: '#e8faf8' },
  warning:  { color: Colors.warn,   label: 'СТАТУС: ВНИМАНИЕ',       bg: '#fff4ec' },
  pending:  { color: Colors.accent, label: 'СТАТУС: ТРЕБУЕТ ОТВЕТА', bg: '#ffeaea' },
  alerting: { color: Colors.accent, label: 'ТРЕВОГА АКТИВНА',        bg: '#ffeaea' },
}

export function StatusCard({ status }: { status: Status }) {
  const cfg = statusConfig[status]
  return (
    <Surface style={[styles.card, { backgroundColor: cfg.bg }]} elevation={0}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text variant="labelLarge" style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </Surface>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  label: { fontWeight: '700', letterSpacing: 0.5 },
})
