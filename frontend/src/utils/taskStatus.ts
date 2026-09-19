import type { TaskStatus } from '../types/task'

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'À faire'
    case 'IN_PROGRESS':
      return 'En cours'
    case 'DONE':
      return 'Terminé'
  }
}

export function statusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'bg-slate-100 text-slate-700 ring-slate-200'
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-800 ring-amber-200'
    case 'DONE':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
  }
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
