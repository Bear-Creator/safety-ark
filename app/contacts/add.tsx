import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Text, TextInput, Button, Surface, Snackbar } from 'react-native-paper'
import { router } from 'expo-router'
import { useContactsStore } from '@/store/contactsStore'
import { Colors } from '@/theme/theme'

export default function AddContactScreen() {
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const addContact = useContactsStore((s) => s.addContact)

  const handleSave = () => {
    if (!name.trim() || !relation.trim() || !phone.trim()) {
      setError('Заполните обязательные поля: Имя, Связь, Телефон')
      return
    }
    addContact({ name: name.trim(), relation: relation.trim(), phone: phone.trim(), email: email.trim() || undefined })
    router.back()
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
          <Text variant="titleMedium" style={styles.title}>Добавить контакт</Text>
        </View>
        <Surface style={styles.card} elevation={1}>
          <TextInput label="Имя *" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          <TextInput label="Связь * (Жена, Отец, Врач...)" value={relation} onChangeText={setRelation} mode="outlined" style={styles.input} />
          <TextInput label="Телефон *" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
          <TextInput label="Email (необязательно)" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <Button mode="contained" onPress={handleSave} style={styles.saveBtn} contentStyle={{ paddingVertical: 6 }}>
            Сохранить контакт
          </Button>
        </Surface>
      </ScrollView>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>{error}</Snackbar>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { color: Colors.text, fontWeight: '700' },
  card: { borderRadius: 20, padding: 20, backgroundColor: Colors.surface },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  saveBtn: { marginTop: 8, borderRadius: 12 },
})
