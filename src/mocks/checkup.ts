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
  { date: '2026-03-08', status: 'ok', respondedAt: '10:03' },
  { date: '2026-03-07', status: 'ok', respondedAt: '18:50' },
  { date: '2026-03-06', status: 'missed', respondedAt: null },
  { date: '2026-03-05', status: 'ok', respondedAt: '09:22' },
  { date: '2026-03-04', status: 'ok', respondedAt: '20:47' },
]
