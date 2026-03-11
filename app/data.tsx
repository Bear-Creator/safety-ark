import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, Chip } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { SectionTitle } from '@/components/SectionTitle'
import { Colors } from '@/theme/theme'

export default function DataScreen() {
  const user = useAuthStore((s) => s.user)
  const [seedVisible, setSeedVisible] = useState(false)
  const seed = 'саван бурый факел кедр тихий маяк орёл прибой'

  const Field = ({ title, value }: { title: string; value: string }) => (
    <View style={styles.field}>
      <Text variant="labelSmall" style={styles.fieldLabel}>{title}</Text>
      <Text variant="bodyMedium" style={styles.fieldValue}>{value}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
        <Text variant="titleMedium" style={styles.title}>Мои данные</Text>
      </View>

      <SectionTitle title="Медицинская информация" />
      <Surface style={styles.card} elevation={1}>
        <Field title="Полное имя" value={user?.name ?? '—'} />
        <Field title="Дата рождения" value={user?.birthDate ?? '—'} />
        <Field title="Группа крови" value={user?.bloodType ?? '—'} />
        <Field title="Аллергии" value={user?.allergies ?? '—'} />
      </Surface>

      <SectionTitle title="Личное сообщение" />
      <Surface style={styles.card} elevation={1}>
        <Text variant="bodyMedium" style={styles.message}>{user?.lastMessage}</Text>
      </Surface>

      <SectionTitle title="Имущество и документы" />
      <Surface style={styles.card} elevation={1}>
        <Field title="Имущество" value={user?.property ?? '—'} />
        <Field title="Нотариус" value={user?.notary ?? '—'} />
      </Surface>

      <SectionTitle title="Seed-фраза (резервная)" />
      <Surface style={styles.card} elevation={1}>
        <Text variant="bodySmall" style={{ color: Colors.text2, marginBottom: 8 }}>
          Для восстановления доступа к зашифрованным данным
        </Text>
        <View style={styles.seedRow}>
          <Text variant="bodyMedium" style={styles.seedText}>
            {seedVisible ? seed : '• • • • • • • •'}
          </Text>
          <Button mode="text" compact onPress={() => setSeedVisible(!seedVisible)} textColor={Colors.accent}>
            {seedVisible ? 'Скрыть' : 'Показать'}
          </Button>
        </View>
        {seedVisible && (
          <View style={styles.seedWords}>
            {seed.split(' ').map((w, i) => (
              <Chip key={i} style={styles.seedChip} textStyle={{ fontSize: 12 }}>{i + 1}. {w}</Chip>
            ))}
          </View>
        )}
      </Surface>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { color: Colors.text, fontWeight: '700' },
  card: { borderRadius: 16, padding: 16, backgroundColor: Colors.surface, marginBottom: 8 },
  field: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.bg },
  fieldLabel: { color: Colors.text3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  fieldValue: { color: Colors.text },
  message: { color: Colors.text, lineHeight: 22, fontStyle: 'italic' },
  seedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seedText: { color: Colors.text, letterSpacing: 2 },
  seedWords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  seedChip: { backgroundColor: Colors.bg },
})
