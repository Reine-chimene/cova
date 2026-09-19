import type { StatusFilter } from '../../types/task'
import { statusLabel } from '../../utils/taskStatus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type TaskToolbarProps = {
  search: string
  statusFilter: StatusFilter
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: StatusFilter) => void
  onCreateClick: () => void
}

const FILTER_OPTIONS: StatusFilter[] = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']

export function TaskToolbar({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onCreateClick,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 gap-4 sm:grid-cols-2">
        <Input
          label="Rechercher des tâches…"
          name="search"
          value={search}
          placeholder="Titre ou description"
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <div className="space-y-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">
            Filtrer par statut
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'ALL' ? 'Tous' : statusLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button className="w-full sm:w-auto" onClick={onCreateClick}>
        Nouvelle tâche
      </Button>
    </div>
  )
}
