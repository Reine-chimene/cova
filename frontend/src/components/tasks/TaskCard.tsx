import type { Task } from '../../types/task'
import { formatDateTime } from '../../utils/taskStatus'
import { Button } from '../ui/Button'
import { TaskStatusBadge } from './TaskStatusBadge'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  deleting?: boolean
}

export function TaskCard({ task, onEdit, onDelete, deleting = false }: TaskCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
            <TaskStatusBadge status={task.status} />
          </div>
          {task.description ? (
            <p className="text-sm leading-6 text-slate-600">{task.description}</p>
          ) : (
            <p className="text-sm italic text-slate-400">Aucune description</p>
          )}
          <dl className="grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
            <div>
              <dt className="inline font-medium">Créée : </dt>
              <dd className="inline">{formatDateTime(task.createdAt)}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Modifiée : </dt>
              <dd className="inline">{formatDateTime(task.updatedAt)}</dd>
            </div>
          </dl>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Button variant="secondary" onClick={() => onEdit(task)}>
            Modifier
          </Button>
          <Button variant="danger" loading={deleting} onClick={() => onDelete(task)}>
            Supprimer
          </Button>
        </div>
      </div>
    </article>
  )
}
