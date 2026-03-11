import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { Colors } from '@/theme/theme'

export function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text variant="labelLarge" style={styles.text}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 16 },
  dot: { width: 4, height: 16, borderRadius: 2, backgroundColor: Colors.accent, marginRight: 8 },
  text: { color: Colors.text, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 },
})
