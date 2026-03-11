import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, Snackbar } from 'react-native-paper'
import { router, useLocalSearchParams } from 'expo-router'
import { useContactsStore } from '@/store/contactsStore'
import { ToggleRow } from '@/components/ToggleRow'
import { Colors } from '@/theme/theme'

export default function ContactSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { contacts, updateContact } = useContactsStore()
  const contact = contacts.find((c) => c.id === id)
  const [saved, setSaved] = useState(false)

  if (!contact) {
    return (
      <View style={styles.center}>
        <Text>Контакт не найден</Text>
        <Button onPress={() => router.back()}>Назад</Button>
      </View>
    )
  }

  const update = (field: string, value: boolean) => updateContact(id, { [field]: value })

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
        <Text variant="titleMedium" style={styles.title}>{contact.name}</Text>
      </View>

      <Surface style={styles.heroCard} elevation={1}>
        <Text style={styles.emoji}>{contact.emoji}</Text>
        <Text variant="titleMedium" style={styles.name}>{contact.name}</Text>
        <Text variant="bodySmall" style={styles.relation}>{contact.relation}</Text>
        <Text variant="bodySmall" style={styles.phone}>{contact.phone}</Text>
      </Surface>

      <Surface style={styles.card} elevation={1}>
        <Text variant="labelLarge" style={styles.sectionLabel}>КАНАЛЫ УВЕДОМЛЕНИЯ</Text>
        <ToggleRow label="SMS" description="Текстовое сообщение при тревоге" value={contact.sms} onValueChange={(v) => update('sms', v)} />
        <ToggleRow label="Звонок" description="Голосовой звонок при тревоге" value={contact.call} onValueChange={(v) => update('call', v)} />
        <ToggleRow label="Email" description="Письмо с подробностями" value={contact.email_notify} onValueChange={(v) => update('email_notify', v)} />
        <ToggleRow label="Капсула данных" description="Передать медицинские данные и сообщение" value={contact.capsule} onValueChange={(v) => update('capsule', v)} />
      </Surface>

      <Button mode="contained" onPress={() => setSaved(true)} style={styles.saveBtn} contentStyle={{ paddingVertical: 6 }}>
        Сохранить настройки
      </Button>
      <Snackbar visible={saved} onDismiss={() => { setSaved(false); router.back() }} duration={1500}>
        Настройки контакта сохранены
      </Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { color: Colors.text, fontWeight: '700' },
  heroCard: { borderRadius: 20, padding: 20, backgroundColor: Colors.surface, alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 40, marginBottom: 8 },
  name: { color: Colors.text, fontWeight: '700' },
  relation: { color: Colors.text2, marginTop: 2 },
  phone: { color: Colors.text3, marginTop: 2 },
  card: { borderRadius: 16, padding: 16, backgroundColor: Colors.surface, marginBottom: 12 },
  sectionLabel: { color: Colors.text3, letterSpacing: 1, marginBottom: 8, fontSize: 11 },
  saveBtn: { borderRadius: 14 },
})
