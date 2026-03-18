import React, { useState } from 'react'
import {
  View, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Modal, FlatList, TouchableOpacity,
} from 'react-native'
import { Text, TextInput, Button, Surface, Snackbar, ActivityIndicator } from 'react-native-paper'
import { router } from 'expo-router'
import * as Contacts from 'expo-contacts'
import { useContactsStore } from '@/store/contactsStore'
import { Colors } from '@/theme/theme'

export default function AddContactScreen() {
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Contact picker state
  const [pickerVisible, setPickerVisible] = useState(false)
  const [pickerLoading, setPickerLoading] = useState(false)
  const [allContacts, setAllContacts] = useState<Contacts.ExistingContact[]>([])
  const [search, setSearch] = useState('')

  const addContact = useContactsStore((s) => s.addContact)

  const handleSave = () => {
    if (!name.trim() || !relation.trim() || !phone.trim()) {
      setError('Заполните обязательные поля: Имя, Связь, Телефон')
      return
    }
    addContact({ name: name.trim(), relation: relation.trim(), phone: phone.trim(), email: email.trim() || undefined })
    router.back()
  }

  const handleOpenPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync()
    if (status !== 'granted') {
      setError('Разрешение не предоставлено. Добавьте контакт вручную.')
      return
    }
    setPickerLoading(true)
    setPickerVisible(true)
    try {
      const result = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        pageSize: 300,
        pageOffset: 0,
      })
      setAllContacts(result.data)
    } finally {
      setPickerLoading(false)
    }
  }

  const handleSelectContact = (contact: Contacts.ExistingContact) => {
    setName(contact.name ?? '')
    setPhone(contact.phoneNumbers?.[0]?.number ?? '')
    setSearch('')
    setPickerVisible(false)
  }

  const filtered = allContacts.filter((c) =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Назад</Button>
          <Text variant="titleMedium" style={styles.title}>Добавить контакт</Text>
        </View>

        {Platform.OS !== 'web' && (
          <Button
            mode="outlined"
            icon="contacts"
            onPress={handleOpenPicker}
            style={styles.pickerBtn}
            textColor={Colors.accent}
          >
            📱 Выбрать из телефона
          </Button>
        )}

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

      {/* Contact picker modal */}
      <Modal visible={pickerVisible} animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text variant="titleMedium" style={styles.modalTitle}>Выбрать контакт</Text>
            <Button mode="text" onPress={() => setPickerVisible(false)} textColor={Colors.accent}>Закрыть</Button>
          </View>

          <TextInput
            label="Поиск"
            value={search}
            onChangeText={setSearch}
            mode="outlined"
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
          />

          {pickerLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ color: Colors.text2 }}>Контакты не найдены</Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id ?? item.name ?? Math.random().toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectContact(item)} style={styles.contactRow} activeOpacity={0.7}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phoneNumbers?.[0]?.number ?? 'Нет номера'}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </Modal>

      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>{error}</Snackbar>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { color: Colors.text, fontWeight: '700' },
  pickerBtn: { marginBottom: 16, borderColor: Colors.accent, borderRadius: 12 },
  card: { borderRadius: 20, padding: 20, backgroundColor: Colors.surface },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  saveBtn: { marginTop: 8, borderRadius: 12 },
  // Modal
  modalRoot: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  modalTitle: { color: Colors.text, fontWeight: '700' },
  searchInput: { marginHorizontal: 16, marginBottom: 8, backgroundColor: Colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contactRow: { paddingVertical: 14, paddingHorizontal: 20 },
  contactName: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  contactPhone: { color: Colors.text2, fontSize: 13, marginTop: 2 },
  separator: { height: 1, backgroundColor: Colors.bg, marginHorizontal: 20 },
})
