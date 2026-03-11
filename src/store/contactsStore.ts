import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { mockContacts, Contact } from '@/mocks/contacts'

const EMOJIS = ['👤', '👩', '👨', '👴', '👩‍⚕️', '👨‍⚕️', '👮', '🧑‍💼']
const COLORS: Contact['color'][] = ['teal', 'orange', 'red']

interface ContactsState {
  contacts: Contact[]
  isLoading: boolean
  addContact: (data: Pick<Contact, 'name' | 'relation' | 'phone'> & { email?: string }) => void
  updateContact: (id: string, data: Partial<Contact>) => void
  removeContact: (id: string) => void
  setLoading: (v: boolean) => void
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: mockContacts,
      isLoading: false,
      addContact: (data) => {
        const { contacts } = get()
        const newContact: Contact = {
          id: Date.now().toString(),
          ...data,
          emoji: EMOJIS[contacts.length % EMOJIS.length],
          color: COLORS[contacts.length % COLORS.length],
          priority: contacts.length + 1,
          sms: true,
          call: false,
          email_notify: !!data.email,
          capsule: false,
        }
        set({ contacts: [...contacts, newContact] })
      },
      updateContact: (id, data) =>
        set({ contacts: get().contacts.map((c) => c.id === id ? { ...c, ...data } : c) }),
      removeContact: (id) =>
        set({ contacts: get().contacts.filter((c) => c.id !== id) }),
      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: 'contacts-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)
