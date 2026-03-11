import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Surface } from 'react-native-paper'
import { Contact } from '@/mocks/contacts'
import { Colors } from '@/theme/theme'

const colorMap = {
  teal: '#e8faf8',
  orange: '#fff4ec',
  red: '#ffeaea',
}
const dotColorMap = {
  teal: Colors.safe,
  orange: Colors.warn,
  red: Colors.accent,
}

interface Props {
  contact: Contact
  onPress: () => void
}

export function ContactItem({ contact, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.card, { backgroundColor: colorMap[contact.color] }]} elevation={0}>
        <View style={[styles.avatar, { backgroundColor: dotColorMap[contact.color] }]}>
          <Text style={styles.emoji}>{contact.emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text variant="titleSmall" style={styles.name}>{contact.name}</Text>
          <Text variant="bodySmall" style={styles.relation}>{contact.relation} · P{contact.priority}</Text>
          <Text variant="bodySmall" style={styles.phone}>{contact.phone}</Text>
        </View>
        <View style={styles.badges}>
          {contact.sms && <Badge label="SMS" color={Colors.safe} />}
          {contact.call && <Badge label="📞" color={Colors.warn} />}
        </View>
      </Surface>
    </TouchableOpacity>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text variant="labelSmall" style={{ color }}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  name: { color: Colors.text, fontWeight: '700' },
  relation: { color: Colors.text2, marginTop: 2 },
  phone: { color: Colors.text3, marginTop: 1 },
  badges: { flexDirection: 'column', gap: 4 },
  badge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
})
