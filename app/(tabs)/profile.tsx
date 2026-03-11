import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Surface, Button, Avatar } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { SectionTitle } from '@/components/SectionTitle'
import { Colors } from '@/theme/theme'

const menuItems = [
  { icon: '📋', label: 'Мои данные', desc: 'Медицинские данные и завещание', route: '/data' },
  { icon: '👥', label: 'Доверенные контакты', desc: 'Кто получит уведомления', route: '/contacts' },
  { icon: '🔒', label: 'Безопасность', desc: 'Пароль и настройки доступа', route: null },
]

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <Surface style={styles.hero} elevation={1}>
        <Avatar.Text size={64} label={(user?.name ?? 'А')[0]} style={{ backgroundColor: Colors.accent }} />
        <Text variant="titleLarge" style={styles.name}>{user?.name ?? 'Пользователь'}</Text>
        <Text variant="bodySmall" style={styles.email}>{user?.email}</Text>
        <Text variant="bodySmall" style={styles.phone}>{user?.phone}</Text>
      </Surface>

      <SectionTitle title="Аккаунт" />
      <Surface style={styles.menu} elevation={1}>
        {menuItems.map((item, i) => (
          <Button
            key={i}
            mode="text"
            icon={() => <Text style={{ fontSize: 20 }}>{item.icon}</Text>}
            onPress={() => item.route ? router.push(item.route as any) : null}
            style={styles.menuItem}
            contentStyle={styles.menuContent}
            textColor={Colors.text}
          >
            <View>
              <Text variant="bodyMedium" style={{ color: Colors.text, fontWeight: '600' }}>{item.label}</Text>
              <Text variant="bodySmall" style={{ color: Colors.text2 }}>{item.desc}</Text>
            </View>
          </Button>
        ))}
      </Surface>

      <Button mode="outlined" onPress={logout} style={styles.logoutBtn} textColor={Colors.accent} icon="logout">
        Выйти
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  hero: { borderRadius: 20, padding: 24, alignItems: 'center', backgroundColor: Colors.surface, marginBottom: 8 },
  name: { color: Colors.text, fontWeight: '700', marginTop: 12 },
  email: { color: Colors.text2, marginTop: 4 },
  phone: { color: Colors.text3, marginTop: 2 },
  menu: { borderRadius: 16, backgroundColor: Colors.surface, overflow: 'hidden', marginBottom: 16 },
  menuItem: { justifyContent: 'flex-start', borderRadius: 0, paddingVertical: 4 },
  menuContent: { justifyContent: 'flex-start', paddingHorizontal: 8 },
  logoutBtn: { borderRadius: 14, borderColor: Colors.accent },
})
