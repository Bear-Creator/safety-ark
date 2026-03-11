import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import { Colors } from '@/theme/theme'

interface Props {
  label: string
  description?: string
  value: boolean
  onValueChange: (v: boolean) => void
}

export function ToggleRow({ label, description, value, onValueChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text variant="bodyMedium" style={{ color: Colors.text }}>{label}</Text>
        {description && <Text variant="bodySmall" style={{ color: Colors.text3 }}>{description}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} color={Colors.accent} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  textBlock: { flex: 1, marginRight: 12 },
})
