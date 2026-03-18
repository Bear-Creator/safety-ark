import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, TextInput, Snackbar } from 'react-native-paper'
import { router } from 'expo-router'
import { useCheckupStore } from '@/store/checkupStore'
import { useContactsStore } from '@/store/contactsStore'
import { SendingRow } from '@/components/SendingRow'
import { Colors } from '@/theme/theme'
import { haptics } from '@/utils/haptics'

export default function FailScreen() {
  const cancelAlert = useCheckupStore((s) => s.cancelAlert)
  const { contacts } = useContactsStore()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    haptics.error()
  }, [])

  const handleCancel = () => {
    const ok = cancelAlert(password)
    if (ok) {
      router.replace('/(tabs)/')
    } else {
      setError(true)
    }
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.alertHeader}>
        <Text style={styles.alertIcon}>🚨</Text>
        <Text style={styles.alertTitle}>ТРЕВОГА АКТИВИРОВАНА</Text>
        <Text style={styles.alertSub}>Уведомления отправляются контактам</Text>
      </View>

      <Surface style={styles.card} elevation={1}>
        <Text variant="titleSmall" style={styles.cardTitle}>Статус отправки</Text>
        {contacts.length === 0 ? (
          <Text style={{ color: '#cccccc', marginTop: 8 }}>Нет доверенных контактов</Text>
        ) : (
          contacts.map((c, i) => (
            <React.Fragment key={c.id}>
              <Text variant="labelMedium" style={styles.contactName}>{c.emoji} {c.name}</Text>
              {c.sms && <SendingRow icon="📱" label="SMS" delayMs={i * 600 + 300} />}
              {c.call && <SendingRow icon="📞" label="Звонок" delayMs={i * 600 + 900} />}
              {c.email_notify && <SendingRow icon="📧" label="Email" delayMs={i * 600 + 1500} />}
              {c.capsule && <SendingRow icon="💊" label="Капсула данных" delayMs={i * 600 + 2100} />}
            </React.Fragment>
          ))
        )}
        <SendingRow icon="📍" label="Геолокация (мок)" delayMs={500} />
      </Surface>

      {!showPassword ? (
        <Button mode="outlined" onPress={() => setShowPassword(true)} style={styles.cancelBtn} textColor={Colors.text2}>
          🔐 Отменить тревогу (ввести пароль)
        </Button>
      ) : (
        <Surface style={styles.card} elevation={1}>
          <Text variant="bodyMedium" style={{ color: Colors.text, marginBottom: 10 }}>
            Введите пароль для отмены тревоги
          </Text>
          <TextInput label="Пароль" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={{ backgroundColor: Colors.surface }} />
          <Button mode="contained" onPress={handleCancel} style={{ marginTop: 12, borderRadius: 12 }}>
            Подтвердить
          </Button>
        </Surface>
      )}

      <Snackbar visible={error} onDismiss={() => setError(false)} duration={3000}>
        Неверный пароль. Попробуйте ещё раз.
      </Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f0608' },
  container: { padding: 24, paddingBottom: 48 },
  alertHeader: { alignItems: 'center', marginBottom: 24, paddingTop: 40 },
  alertIcon: { fontSize: 64, marginBottom: 12 },
  alertTitle: { color: Colors.accent, fontSize: 22, fontWeight: '700', letterSpacing: 2 },
  alertSub: { color: '#ff9999', marginTop: 4 },
  card: { borderRadius: 20, padding: 20, backgroundColor: '#1a0a0c', marginBottom: 12 },
  cardTitle: { color: '#ffffff', fontWeight: '700', marginBottom: 12 },
  contactName: { color: '#cccccc', marginTop: 12, marginBottom: 4 },
  cancelBtn: { borderRadius: 14, borderColor: Colors.text3, marginTop: 8 },
})
