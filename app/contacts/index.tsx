import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Button, ActivityIndicator, FAB } from 'react-native-paper'
import { router } from 'expo-router'
import { useContactsStore } from '@/store/contactsStore'
import { ContactItem } from '@/components/ContactItem'
import { Colors } from '@/theme/theme'

export default function ContactsScreen() {
  const { contacts, isLoading } = useContactsStore()

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
          <Text variant="titleMedium" style={styles.title}>Доверенные контакты</Text>
        </View>

        {contacts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text variant="titleSmall" style={styles.emptyTitle}>Нет контактов</Text>
            <Text variant="bodySmall" style={styles.emptyDesc}>Добавьте доверенных людей, которые получат уведомление при тревоге</Text>
          </View>
        ) : (
          contacts.map((c) => (
            <ContactItem key={c.id} contact={c} onPress={() => router.push(`/contacts/${c.id}` as any)} />
          ))
        )}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/contacts/add')} color="#fff" customSize={56} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { color: Colors.text, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: Colors.text, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { color: Colors.text2, textAlign: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: Colors.accent, borderRadius: 28 },
})
