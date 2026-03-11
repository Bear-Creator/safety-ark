import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Text, TextInput, Button, Surface, ProgressBar } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { mockUser } from '@/mocks/user'
import { Colors } from '@/theme/theme'

export default function RegisterScreen() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState(mockUser.email)
  const [password, setPassword] = useState('1234')
  const [name, setName] = useState(mockUser.name)
  const [phone, setPhone] = useState(mockUser.phone)
  const [birthDate, setBirthDate] = useState(mockUser.birthDate)
  const [bloodType, setBloodType] = useState(mockUser.bloodType)
  const [contactName, setContactName] = useState('Мария Смирнова')
  const [contactPhone, setContactPhone] = useState('+7 (916) 234-56-78')

  const completeRegistration = useAuthStore((s) => s.completeRegistration)
  const steps = ['Аккаунт', 'Личные данные', 'Экстренный контакт']

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      completeRegistration({ name, phone, email, birthDate, bloodType })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Button mode="text" icon="arrow-left" onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
            Назад
          </Button>
          <Text variant="titleMedium" style={styles.stepLabel}>Шаг {step + 1} из 3</Text>
        </View>

        <Text variant="headlineSmall" style={styles.title}>Регистрация</Text>
        <ProgressBar progress={(step + 1) / 3} color={Colors.accent} style={styles.progress} />

        <View style={styles.tabs}>
          {steps.map((s, i) => (
            <Text key={i} variant="labelSmall" style={[styles.tab, i === step && styles.tabActive]}>{s}</Text>
          ))}
        </View>

        <Surface style={styles.card} elevation={1}>
          {step === 0 && (
            <>
              <Text variant="titleSmall" style={styles.cardTitle}>Данные аккаунта</Text>
              <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
              <TextInput label="Пароль" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} />
            </>
          )}
          {step === 1 && (
            <>
              <Text variant="titleSmall" style={styles.cardTitle}>Личная информация</Text>
              <TextInput label="Полное имя" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
              <TextInput label="Телефон" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
              <TextInput label="Дата рождения" value={birthDate} onChangeText={setBirthDate} mode="outlined" style={styles.input} />
              <TextInput label="Группа крови" value={bloodType} onChangeText={setBloodType} mode="outlined" style={styles.input} />
            </>
          )}
          {step === 2 && (
            <>
              <Text variant="titleSmall" style={styles.cardTitle}>Экстренный контакт</Text>
              <Text variant="bodySmall" style={{ color: Colors.text2, marginBottom: 12 }}>
                Этот человек получит уведомление первым, если вы не ответите на чек-ап.
              </Text>
              <TextInput label="Имя контакта" value={contactName} onChangeText={setContactName} mode="outlined" style={styles.input} />
              <TextInput label="Телефон" value={contactPhone} onChangeText={setContactPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
            </>
          )}

          <Button mode="contained" onPress={handleNext} style={styles.btn} contentStyle={{ paddingVertical: 6 }}>
            {step < 2 ? 'Продолжить' : 'Создать аккаунт'}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { flexGrow: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stepLabel: { color: Colors.text2 },
  title: { color: Colors.text, fontWeight: '700', marginBottom: 12 },
  progress: { height: 4, borderRadius: 2, marginBottom: 8 },
  tabs: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  tab: { color: Colors.text3 },
  tabActive: { color: Colors.accent, fontWeight: '700' },
  card: { borderRadius: 20, padding: 24, backgroundColor: Colors.surface },
  cardTitle: { color: Colors.text, fontWeight: '700', marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  btn: { marginTop: 8, borderRadius: 12 },
})
