import type { TaskStatus } from '../../types/task'
import { statusBadgeClass, statusLabel } from '../../utils/taskStatus'

type TaskStatusBadgeProps = {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(status)}`}
    >
      {statusLabel(status)}
    </span>
  )
}
