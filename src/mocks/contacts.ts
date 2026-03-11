export interface Contact {
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
  {
    id: '1', name: 'Мария Смирнова', relation: 'Жена',
    phone: '+7 (916) 234-56-78', email: 'maria@example.com',
    emoji: '👩', color: 'teal', priority: 1,
    sms: true, call: true, email_notify: true, capsule: true,
  },
  {
    id: '2', name: 'Виктор Смирнов', relation: 'Отец',
    phone: '+7 (903) 345-67-89',
    emoji: '👴', color: 'orange', priority: 2,
    sms: true, call: true, email_notify: false, capsule: false,
  },
  {
    id: '3', name: 'Д-р Козлов А.В.', relation: 'Врач',
    phone: '+7 (495) 678-90-12',
    emoji: '👨‍⚕️', color: 'red', priority: 3,
    sms: true, call: false, email_notify: false, capsule: false,
  },
]
