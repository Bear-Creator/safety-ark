import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, ActivityIndicator } from 'react-native-paper'
import { Colors } from '@/theme/theme'

type SendStatus = 'pending' | 'sending' | 'done' | 'failed'

interface Props {
  icon: string
  label: string
  delayMs: number
}

export function SendingRow({ icon, label, delayMs }: Props) {
  const [status, setStatus] = useState<SendStatus>('pending')

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('sending'), delayMs)
    const t2 = setTimeout(() => setStatus('done'), delayMs + 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delayMs])

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      {status === 'pending' && <Text style={styles.pending}>⏳</Text>}
      {status === 'sending' && <ActivityIndicator size={16} color={Colors.accent} />}
      {status === 'done'    && <Text style={styles.done}>✓</Text>}
      {status === 'failed'  && <Text style={styles.failed}>✗</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  icon: { fontSize: 20, marginRight: 10 },
  label: { flex: 1, color: '#1a1f2e', fontSize: 15 },
  pending: { fontSize: 16, color: '#8b949e' },
  done: { fontSize: 18, color: '#2ec4b6', fontWeight: '700' },
  failed: { fontSize: 18, color: '#e63946', fontWeight: '700' },
})
