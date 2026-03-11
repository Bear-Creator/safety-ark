import React from 'react'
import { Tabs } from 'expo-router'
import { Text } from 'react-native-paper'
import { Colors } from '@/theme/theme'

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.text3,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.outline,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Главная',   tabBarIcon: () => <TabIcon emoji="🏠" /> }} />
      <Tabs.Screen name="checkup"  options={{ title: 'Чек-ап',    tabBarIcon: () => <TabIcon emoji="⚡" /> }} />
      <Tabs.Screen name="profile"  options={{ title: 'Профиль',   tabBarIcon: () => <TabIcon emoji="👤" /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Параметры', tabBarIcon: () => <TabIcon emoji="⚙️" /> }} />
    </Tabs>
  )
}
