import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, Snackbar } from 'react-native-paper'
import { router } from 'expo-router'
import { useCheckupStore } from '@/store/checkupStore'
import { SectionTitle } from '@/components/SectionTitle'
import { Colors } from '@/theme/theme'
import { mockContacts } from '@/mocks/contacts'

const LEVELS = [5, 10, 15, 30, 60]

export default function CheckupSettingsScreen() {
  const store = useCheckupStore()
  const [saved, setSaved] = useState(false)

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
        <Text variant="titleMedium" style={styles.title}>Настройки чек-апа</Text>
      </View>

      <SectionTitle title="Предупреждение (пре-тревога)" />
      <Surface style={styles.card} elevation={1}>
        <Text variant="bodySmall" style={styles.desc}>За сколько минут до тревоги предупредить</Text>
        <View style={styles.chips}>
          {LEVELS.map((m) => (
            <Button key={m} mode={store.preWarningMinutes === m ? 'contained' : 'outlined'} onPress={() => store.setPreWarningMinutes(m)} compact style={styles.chip}>{m}м</Button>
          ))}
        </View>
      </Surface>

      <SectionTitle title="Финальная тревога" />
      <Surface style={styles.card} elevation={1}>
        <Text variant="bodySmall" style={styles.desc}>Время ответа после пре-тревоги</Text>
        <View style={styles.chips}>
          {LEVELS.map((m) => (
            <Button key={m} mode={store.finalAlertMinutes === m ? 'contained' : 'outlined'} onPress={() => store.setFinalAlertMinutes(m)} compact style={styles.chip}>{m}м</Button>
          ))}
        </View>
      </Surface>

      <SectionTitle title="Уведомление контактов" />
      <Surface style={styles.card} elevation={1}>
        {mockContacts.map((c) => (
          <View key={c.id} style={styles.contactRow}>
            <Text style={styles.contactName}>{c.emoji} {c.name}</Text>
            <Text variant="bodySmall" style={{ color: Colors.text3 }}>
              {[c.sms && 'SMS', c.call && 'Звонок', c.email_notify && 'Email'].filter(Boolean).join(', ')}
            </Text>
          </View>
        ))}
      </Surface>

      <Button mode="contained" onPress={() => setSaved(true)} style={styles.saveBtn} contentStyle={{ paddingVertical: 6 }}>
        Сохранить
      </Button>
      <Snackbar visible={saved} onDismiss={() => { setSaved(false); router.back() }} duration={1500}>
        Настройки сохранены
      </Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { color: Colors.text, fontWeight: '700' },
  card: { borderRadius: 16, padding: 16, backgroundColor: Colors.surface, marginBottom: 8 },
  desc: { color: Colors.text2, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20 },
  contactRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.bg },
  contactName: { color: Colors.text, fontWeight: '600' },
  saveBtn: { marginTop: 16, borderRadius: 14 },
})
