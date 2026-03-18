import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

const isNative = Platform.OS !== 'web'

export const haptics = {
  /** Light impact — e.g. simulate shake */
  light: () => isNative && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** Heavy impact — reserved */
  heavy: () => isNative && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  /** Warning notification — e.g. timer running low */
  warning: () => isNative && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  /** Error notification — e.g. alert activated */
  error: () => isNative && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
}
