import React, { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Text, TextInput, Button, Surface, Snackbar } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { Colors } from '@/theme/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const login = useAuthStore((s) => s.login)

  const handleLogin = () => {
    const ok = login(email, password)
    if (!ok) setError(true)
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>⚡</Text>
          </View>
          <Text variant="headlineLarge" style={styles.title}>SafetyArk</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Ваш цифровой страж безопасности</Text>
        </View>

        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>Войти в аккаунт</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPass}
            right={<TextInput.Icon icon={showPass ? 'eye-off' : 'eye'} onPress={() => setShowPass(!showPass)} />}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleLogin} style={styles.btn} contentStyle={{ paddingVertical: 6 }}>
            Войти
          </Button>

          <Button mode="text" onPress={() => router.push('/(auth)/register')} style={{ marginTop: 4 }}>
            Ещё нет аккаунта? Зарегистрироваться
          </Button>
        </Surface>
      </ScrollView>

      <Snackbar visible={error} onDismiss={() => setError(false)} duration={3000}>
        Заполните email и пароль
      </Snackbar>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { alignItems: 'center', marginBottom: 32 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoText: { fontSize: 32 },
  title: { color: Colors.text, fontWeight: '700' },
  subtitle: { color: Colors.text2, marginTop: 4 },
  card: { borderRadius: 20, padding: 24, backgroundColor: Colors.surface },
  cardTitle: { color: Colors.text, fontWeight: '700', marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: Colors.surface },
  btn: { marginTop: 8, borderRadius: 12 },
})
