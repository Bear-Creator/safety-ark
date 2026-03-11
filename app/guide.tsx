import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Button, Surface } from 'react-native-paper'
import { useAuthStore } from '@/store/authStore'
import { Colors } from '@/theme/theme'

const guideSteps = [
  { icon: '⏱️', title: 'Периодические чек-апы', desc: 'Приложение регулярно спрашивает: вы в порядке? Потрясите телефон или нажмите кнопку — таймер сбросится.' },
  { icon: '🚨', title: 'Автоматическая тревога', desc: 'Если вы не ответили в течение заданного времени — SafetyArk автоматически оповещает ваших доверенных контактов.' },
  { icon: '💊', title: 'Капсула данных', desc: 'При тревоге контакты получат вашу медицинскую информацию, геолокацию и личное сообщение.' },
]

export default function GuideScreen() {
  const setOnboardingDone = useAuthStore((s) => s.setOnboardingDone)

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>КАК ЭТО РАБОТАЕТ</Text>
        <Text variant="headlineMedium" style={styles.title}>Ваш персональный страж</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          SafetyArk следит за вашей безопасностью 24/7 и связывается с близкими, если что-то идёт не так.
        </Text>
      </View>

      {guideSteps.map((s, i) => (
        <Surface key={i} style={styles.card} elevation={1}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{s.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text variant="titleSmall" style={styles.cardTitle}>{s.title}</Text>
            <Text variant="bodySmall" style={styles.cardDesc}>{s.desc}</Text>
          </View>
        </Surface>
      ))}

      <Button mode="contained" onPress={setOnboardingDone} style={styles.btn} contentStyle={{ paddingVertical: 8 }}>
        Начать настройку
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 24 },
  badge: { color: Colors.accent, fontWeight: '700', letterSpacing: 2, fontSize: 11, marginBottom: 8 },
  title: { color: Colors.text, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: Colors.text2, lineHeight: 22 },
  card: { flexDirection: 'row', borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: Colors.surface, alignItems: 'flex-start' },
  iconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#ffeaea', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  icon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { color: Colors.text, fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: Colors.text2, lineHeight: 20 },
  btn: { marginTop: 24, borderRadius: 14 },
})
