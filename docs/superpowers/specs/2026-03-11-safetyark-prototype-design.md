# SafetyArk — Prototype Design Spec
**Date:** 2026-03-11
**Team:** ThetaIX (Кузин Илья), Bear-Creator (Федорищев Михаил), q8yAzooz (Дюбов Максим)
**Repo:** https://github.com/q8yAzooz/SafetyArk.git

---

## 1. Overview

SafetyArk — мобильное приложение класса "dead man's switch". Периодически запрашивает подтверждение активности пользователя. При отсутствии ответа — автоматически уведомляет доверенных контактов с геолокацией и капсулой данных.

---

## 2. Tech Stack

| Слой | Технология |
|---|---|
| Framework | Expo SDK 52 + Expo Router v4 (file-based routing) |
| UI | React Native Paper v5 (Material Design 3) |
| Language | TypeScript |
| State | Zustand |
| Storage | AsyncStorage (persist timer state) |
| Sensors | expo-sensors (Accelerometer для shake detection) |
| Platform | iOS, Android, Web (единая кодовая база) |

**Запуск:**
- `npx expo start` — мобильный (QR-код / эмулятор)
- `npx expo start --web` — браузер

---

## 3. Design System

Цвета строго из `safetyarc-design.html`:

```ts
accent:  '#e63946'   // красный, опасность / primary action
accent2: '#ff6b6b'   // светло-красный
safe:    '#2ec4b6'   // бирюзовый, безопасность
warn:    '#f4a261'   // оранжевый, предупреждение
bg:      '#f5f7fa'
surface: '#ffffff'
text:    '#1a1f2e'
text2:   '#586069'
text3:   '#8b949e'
```

Шрифты: **Syne** (заголовки, кнопки) + **DM Sans** (тело) через `@expo-google-fonts`.
Компоненты: скруглённые карточки (16–24px radius), тени, градиенты как в макете.
MD3 тема настраивается через `src/theme/theme.ts` с переопределением цветовой схемы (primary = accent, secondary = safe).

---

## 4. Project Structure

```
SafetyArk/
├── app/
│   ├── _layout.tsx                  # Root layout: auth guard
│   │                                #   isAuthenticated=false → redirect (auth)/index
│   │                                #   isAuthenticated=true, !onboardingDone → guide
│   │                                #   isAuthenticated=true, onboardingDone → (tabs)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Screen 1: Login
│   │   └── register.tsx             # Screen 2: Registration (3 steps)
│   ├── guide.tsx                    # Screen 3: How it works (shown once after registration)
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Bottom tab navigator
│   │   ├── index.tsx                # Screen 4: Home (timer + status)
│   │   ├── profile.tsx              # Screen 5: Profile menu
│   │   ├── settings.tsx             # Screen 8: Parameters
│   │   └── checkup.tsx              # Screen 9: Check-up
│   ├── data.tsx                     # Screen 6: My data (read-only capsule view)
│   ├── contacts/
│   │   ├── index.tsx                # Screen 7: Trusted contacts list
│   │   ├── add.tsx                  # Screen 7b: Add contact form (modal/stack)
│   │   └── [id].tsx                 # Screen 12: Single contact settings
│   ├── checkup-settings.tsx         # Screen 11: Check-up settings
│   └── fail.tsx                     # Screen 10: Alert activated
├── src/
│   ├── mocks/
│   │   ├── user.ts                  # Mock user data
│   │   ├── contacts.ts              # Mock contacts (shared dep, created in feature/auth-screens)
│   │   └── checkup.ts               # Mock timer config + history
│   ├── store/
│   │   ├── authStore.ts             # isAuthenticated, onboardingDone, user, login(), logout()
│   │   ├── checkupStore.ts          # timer state machine + initial state shape
│   │   └── contactsStore.ts         # contacts list, addContact(), updateContact()
│   ├── theme/
│   │   └── theme.ts                 # MD3 custom theme
│   ├── hooks/
│   │   └── useShake.ts              # Accelerometer hook (see Section 7)
│   └── components/
│       ├── StatusCard.tsx
│       ├── ContactItem.tsx
│       ├── ToggleRow.tsx
│       ├── SectionTitle.tsx
│       ├── IntervalChips.tsx
│       └── SendingRow.tsx
├── docs/superpowers/specs/
├── README.md
├── app.json
├── tsconfig.json
└── package.json
```

---

## 5. Navigation & Auth Guard

Root `_layout.tsx` reads `authStore`:
1. `isAuthenticated === false` → push to `/(auth)/index` (Login)
2. `isAuthenticated === true && onboardingDone === false` → push to `/guide`
3. `isAuthenticated === true && onboardingDone === true` → push to `/(tabs)`

**Login screen (Screen 1):**
- Принимает любой email + пароль (мок — любые непустые строки)
- Кнопка "Ещё нет аккаунта? Зарегистрироваться" → `/(auth)/register`
- При успехе: `authStore.login()` устанавливает `isAuthenticated=true, onboardingDone=false` → guard перенаправляет на `/guide`

**Registration (Screen 2):**
- 3 шага: (1) email/пароль, (2) личные данные, (3) экстренный контакт
- Данные предзаполнены из `mocks/user.ts` для удобства демо
- "Продолжить" на шаге 3 → `authStore.completeRegistration()` → guard перенаправляет на `/guide`

**Guide (Screen 3):**
- Показывается однократно после регистрации
- "Начать настройку" → `authStore.setOnboardingDone(true)` → guard перенаправляет на `/(tabs)`

---

## 6. End-to-End Scenario (Full Cycle C)

```
[1. Login] → любой email + пароль → мок-аутентификация → /guide
    ↓
[2. Register] → 3 шага, данные из mocks/user.ts → /guide
    ↓
[3. Guide] → "Начать настройку" → /(tabs)/index
    ↓
[4. Home] → таймер отсчитывает, статус зависит от state:
    │   normal: зелёный, "СТАТУС: БЕЗОПАСНО"
    │   warning: оранжевый, "СТАТУС: ВНИМАНИЕ" (< warningMinutes)
    │   Кнопка "Я в норме" → checkupStore.confirmOk() → таймер сброшен
    │
    ↓ (вкладка Профиль)
[5. Profile] → меню:
    │   "Мои данные" → /data
    │   "Доверенные контакты" → /contacts
    │   "Безопасность" → заглушка (Snackbar "В разработке")
    │   "Выйти" → authStore.logout()
    │
[6. My Data] → read-only просмотр капсулы
    │   seed-фраза: tap → toggle visible/masked (локальный стейт)
    │   "+" Добавить данные → Snackbar "В разработке" (в scope не входит)
    │
[7. Contacts] → список из contactsStore
    │   "Добавить контакт" → /contacts/add (форма ручного ввода)
    │   tap на контакт → /contacts/[id]
    │
[7b. Add Contact] → форма: имя, связь, телефон, email (опционально)
    │   "Сохранить" → contactsStore.addContact() → назад к списку
    │
[12. Contact Settings] → переключатели SMS/Звонок/Email/Капсула, слайдер приоритета
    │   "Сохранить настройки" → contactsStore.updateContact()
    │
    ↓ (вкладка Параметры)
[8. Settings] → интервал (1ч/4ч/12ч/24ч), тогглы
    │   "Настройки Check-up" → /checkup-settings
    │
[11. Checkup Settings] → уровни тревоги (pre-warning / final), матрица контакт×канал
    │   "Сохранить" → checkupStore.saveSettings()
    │
    ↓ (вкладка Чек-ап или автоматически когда таймер → 0)
[9. Checkup] → state = pending
    │   пульс-кольцо, таймер 15 сек на ответ
    │   "Я в норме!" → confirmOk() → Home
    │   SHAKE (mobile) / "🤳 Имитировать тряску" (web) → confirmOk() → Home
    │   "Нужна помощь" → triggerAlert() → /fail
    │   "Позже" (snooze) → snooze(5 мин) → state = pending через 5 мин, возврат на Home
    │   responseTimeout (15 сек истекло) → triggerAlert() → /fail
    │
[10. Alert] → state = alerting
    │   мок-отправка: анимированная последовательность статусов ⏳ → ✓ (setTimeout)
    │   "Отменить тревогу (пароль)" → показать TextInput с паролем
    │   ввод "1234" → cancelAlert() → Home
    │   неверный пароль → Snackbar "Неверный пароль"
```

---

## 7. State Machine (`checkupStore`)

### State Shape
```ts
type CheckupStatus = 'normal' | 'warning' | 'pending' | 'alerting'

interface CheckupState {
  status: CheckupStatus
  intervalHours: number          // из настроек
  warningMinutes: number         // pre-warning threshold
  responseTimeoutSec: number     // сколько секунд на ответ в чек-апе (15)
  snoozeDurationMin: number      // длительность snooze (5)
  timerStartedAt: number | null  // Date.now() при старте
  timeRemainingMs: number        // вычисляется в UI через useMemo
  lastConfirmedAt: number | null
  cancelPassword: string         // '1234'
  preWarningMinutes: number      // 30 по умолчанию
  finalAlertMinutes: number      // 15 по умолчанию
  notificationSettings: Record<string, { sms: boolean; call: boolean; email: boolean }>
}
```

### Transitions
```
normal ──[timer reaches warningMinutes]──→ warning
warning ──[timer reaches 0]──→ pending
normal ──[confirmOk]──→ normal (reset timer)
pending ──[confirmOk / shake]──→ normal
pending ──[snooze]──→ normal (timer += snoozeDurationMin)
pending ──[needHelp / responseTimeout]──→ alerting
alerting ──[cancelAlert("1234")]──→ normal
alerting ──[wrong password]──→ alerting (show error)
```

### Home Screen Visual by Status
| Status | Dot color | Label | Card background |
|---|---|---|---|
| normal | `#2ec4b6` | СТАТУС: БЕЗОПАСНО | teal gradient |
| warning | `#f4a261` | СТАТУС: ВНИМАНИЕ | orange gradient |
| pending | `#e63946` | СТАТУС: ТРЕБУЕТ ОТВЕТА | red gradient |
| alerting | `#e63946` | ТРЕВОГА АКТИВНА | red gradient |

---

## 8. Mocks

### `src/mocks/user.ts`
```ts
export const mockUser = {
  id: '1',
  name: 'Алексей Смирнов',
  phone: '+7 (916) 123-45-67',
  email: 'alexey@example.com',
  birthDate: '12 Марта 1985',
  bloodType: 'A(II) Rh+',
  allergies: 'Пенициллин, аспирин',
  lastMessage: 'Дорогие мои, если вы читаете это — знайте, что я вас очень люблю...',
  property: 'Квартира — ЖК Сосновый бор, кв. 47',
  notary: 'Иванова Л.В., +7 495 ...',
  cancelPassword: '1234',   // пароль отмены тревоги
}
```

### `src/mocks/contacts.ts`  ← создаётся в `feature/auth-screens` (shared dep)
```ts
export type Contact = {
  id: string
  name: string
  relation: string
  phone: string
  email?: string
  emoji: string
  color: 'teal' | 'orange' | 'red'
  priority: number
  sms: boolean
  call: boolean
  email_notify: boolean
  capsule: boolean
}

export const mockContacts: Contact[] = [
  { id: '1', name: 'Мария Смирнова', relation: 'Жена', phone: '+7 916 234-56-78', emoji: '👩', color: 'teal', priority: 1, sms: true, call: true, email_notify: true, capsule: true },
  { id: '2', name: 'Виктор Смирнов', relation: 'Отец', phone: '+7 903 345-67-89', emoji: '👴', color: 'orange', priority: 2, sms: true, call: true, email_notify: false, capsule: false },
  { id: '3', name: 'Д-р Козлов А.В.', relation: 'Врач', phone: '+7 495 678-90-12', emoji: '👨‍⚕️', color: 'red', priority: 3, sms: true, call: false, email_notify: false, capsule: false },
]
```

### `src/mocks/checkup.ts`
```ts
export const mockCheckupConfig = {
  intervalHours: 12,
  warningMinutes: 30,
  preWarningMinutes: 30,
  finalAlertMinutes: 15,
  responseTimeoutSec: 15,
  snoozeDurationMin: 5,
  cancelPassword: '1234',
}

export const mockCheckupHistory = [
  { date: '2026-03-10', status: 'ok', respondedAt: '09:41' },
  { date: '2026-03-09', status: 'ok', respondedAt: '21:15' },
  // 7 entries total
]
```

---

## 9. Platform-Specific Features

### Shake Detection (`src/hooks/useShake.ts`)

**Interface:**
```ts
// onShake вызывается при обнаружении тряски (mobile) или при ручном вызове (web)
function useShake(onShake: () => void): {
  isAvailable: boolean   // false на web — показать кнопку-заглушку
  simulateShake: () => void  // для web: вызов вручную кнопкой
}
```

**Mobile:** подписка на `Accelerometer` из `expo-sensors`. Порог: magnitude > 1.5g. Cooldown 2 сек между срабатываниями. `onShake()` вызывается при превышении порога.

**Web:** `isAvailable = false`. Компонент показывает кнопку "🤳 Имитировать тряску" рядом с hint-текстом, при нажатии вызывает `simulateShake()` → `onShake()`.

### Contacts Form (Screen 7b: `/contacts/add`)
**Поля формы:**
```
Имя*          [TextInput]
Связь*        [TextInput, e.g. "Жена", "Отец", "Врач"]
Телефон*      [TextInput, type=phone-pad]
Email         [TextInput, type=email, optional]
```
`contactsStore.addContact({ name, relation, phone, email? })` → генерирует `id = Date.now().toString()`, emoji выбирается рандомно из набора, color назначается циклически (teal/orange/red), priority = contacts.length + 1.

---

## 10. State Handling

Везде по паттерну:
- `loading` — `ActivityIndicator` (MD3 `<ActivityIndicator>`) по центру экрана, пока Zustand гидрируется из AsyncStorage
- `normal` — основной контент
- `empty` — иконка + заглушка-текст (пример: "Нет контактов — добавьте первый")
- `error` — `Snackbar` (MD3) с кнопкой "Повторить"

---

## 11. Team Branches & PR Plan

**ВАЖНО:** `mocks/contacts.ts` создаётся в `feature/auth-screens` как shared dependency, чтобы `feature/checkup-flow` (Screen 11 использует контакты) мог мержиться после него.

**Порядок merge:**
1. `feature/auth-screens` → main *(создаёт базовую структуру, mocks/user, mocks/contacts, authStore, тему)*
2. `feature/checkup-flow` → main *(ключевой сценарий, опирается на mocks/contacts)*
3. `feature/profile-contacts` → main *(профиль, contactsStore)*

| Участник | GitHub | Ветка | Ответственность |
|---|---|---|---|
| Кузин Илья | ThetaIX | `feature/auth-screens` | Screens 1,2,3; authStore; mocks/user.ts; **mocks/contacts.ts**; theme.ts; базовая структура проекта |
| Дюбов Максим | q8yAzooz | `feature/checkup-flow` | Screens 4,8,9,10,11; checkupStore; useShake.ts; mocks/checkup.ts |
| Федорищев Михаил | Bear-Creator | `feature/profile-contacts` | Screens 5,6,7,7b,12; contactsStore; компоненты ContactItem, SendingRow |

---

## 12. README Structure (requirements)

```markdown
# SafetyArk

## Что это
...

## Стек
Expo SDK 52, React Native Paper (MD3), TypeScript, Zustand, expo-sensors

## Запуск
### Мобильное приложение
npx expo start        # Scan QR with Expo Go

### Веб-версия
npx expo start --web  # Opens in browser

## Моки
src/mocks/user.ts       — данные пользователя
src/mocks/contacts.ts   — доверенные контакты
src/mocks/checkup.ts    — конфигурация таймера и история

## Реализованный сценарий
Полный цикл: Регистрация → Гайд → Главная → Профиль → Контакты → Параметры → Чек-ап → Тревога → Отмена

Как проверить:
1. Запустить приложение
2. Войти (любой email + пароль)
3. Пройти регистрацию (данные предзаполнены)
4. Прочитать гайд, нажать "Начать настройку"
5. На главном экране дождаться или нажать вкладку "Чек-ап"
6. На экране чек-апа: потрясти телефон (или нажать кнопку на вебе)
7. Или нажать "Нужна помощь" — сработает тревога
8. Ввести пароль "1234" для отмены тревоги
```
