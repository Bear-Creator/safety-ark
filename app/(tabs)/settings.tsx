import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, Snackbar } from 'react-native-paper'
import { router } from 'expo-router'
import { useCheckupStore } from '@/store/checkupStore'
import { ToggleRow } from '@/components/ToggleRow'
import { SectionTitle } from '@/components/SectionTitle'
import { Colors } from '@/theme/theme'

const INTERVALS = [
  { label: '30с', hours: 30 / 3600 },
  { label: '1м',  hours: 1 / 60 },
  { label: '1ч',  hours: 1 },
  { label: '4ч',  hours: 4 },
  { label: '12ч', hours: 12 },
  { label: '24ч', hours: 24 },
]

const isActiveInterval = (a: number, b: number) => Math.abs(a - b) < 1e-6

export default function SettingsScreen() {
  const store = useCheckupStore()
  const [snackbar, setSnackbar] = React.useState('')

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Параметры</Text>

      <SectionTitle title="Интервал чек-апа" />
      <Surface style={styles.card} elevation={1}>
        <View style={styles.chips}>
          {INTERVALS.map(({ label, hours }) => (
            <Button key={label} mode={isActiveInterval(store.intervalHours, hours) ? 'contained' : 'outlined'} onPress={() => store.setInterval(hours)} style={styles.chip} compact>
              {label}
            </Button>
          ))}
        </View>
      </Surface>

      <SectionTitle title="Уведомления" />
      <Surface style={styles.card} elevation={1}>
        <ToggleRow label="Push-уведомления" description="Напоминания о чек-апе" value={store.notificationsEnabled} onValueChange={store.setNotificationsEnabled} />
        <ToggleRow label="Геолокация" description="Отправлять координаты при тревоге" value={store.locationEnabled} onValueChange={() => setSnackbar('Настройте разрешения в системных настройках')} />
        <ToggleRow label="Капсула данных" description="Отправить медданные контактам" value={store.capsuleEnabled} onValueChange={() => setSnackbar('Настройка в Мои данные')} />
      </Surface>

      <SectionTitle title="Дополнительно" />
      <Surface style={styles.card} elevation={1}>
        <Button mode="text" icon="cog" onPress={() => router.push('/checkup-settings')} contentStyle={styles.menuItem} textColor={Colors.text}>
          Настройки Check-up
        </Button>
      </Surface>

      <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={2500}>{snackbar}</Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  title: { color: Colors.text, fontWeight: '700', marginBottom: 8 },
  card: { borderRadius: 16, padding: 16, backgroundColor: Colors.surface, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20 },
  menuItem: { justifyContent: 'flex-start' },
})
