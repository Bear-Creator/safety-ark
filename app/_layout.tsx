import React, { useEffect } from 'react'
import { Stack, router, useSegments } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { useFonts, Syne_700Bold } from '@expo-google-fonts/syne'
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans'
import { AppTheme } from '@/theme/theme'
import { useAuthStore } from '@/store/authStore'
import { ActivityIndicator, View } from 'react-native'

export default function RootLayout() {
  const { isAuthenticated, onboardingDone } = useAuthStore()
  const segments = useSegments()

  const [fontsLoaded] = useFonts({ Syne_700Bold, DMSans_400Regular, DMSans_500Medium })

  useEffect(() => {
    if (!fontsLoaded) return
    const inAuth = segments[0] === '(auth)'
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/')
    } else if (isAuthenticated && !onboardingDone && segments[0] !== 'guide') {
      router.replace('/guide')
    } else if (isAuthenticated && onboardingDone && (inAuth || segments[0] === 'guide')) {
      router.replace('/(tabs)/')
    }
  }, [isAuthenticated, onboardingDone, fontsLoaded])

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>
  }

  return (
    <PaperProvider theme={AppTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  )
}
