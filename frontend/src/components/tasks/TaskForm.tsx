import { useEffect, useState, type FormEvent } from 'react'
import { TASK_STATUSES, type CreateTaskRequest, type Task, type TaskStatus } from '../../types/task'
import { statusLabel } from '../../utils/taskStatus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

export type TaskFormValues = {
  title: string
  description: string
  status: TaskStatus
}

type TaskFormProps = {
  initialTask?: Task
  submitLabel: string
  loading?: boolean
  onSubmit: (values: CreateTaskRequest | TaskFormValues) => Promise<void>
  onCancel: () => void
}

export function TaskForm({
  initialTask,
  submitLabel,
  loading = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'TODO')
  const [errors, setErrors] = useState<{ title?: string }>({})

  useEffect(() => {
    setTitle(initialTask?.title ?? '')
    setDescription(initialTask?.description ?? '')
    setStatus(initialTask?.status ?? 'TODO')
    setErrors({})
  }, [initialTask])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setErrors({ title: 'Le titre est obligatoire' })
      return
    }

    await onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      status,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <Input
        label="Titre"
        name="title"
        value={title}
        maxLength={255}
        onChange={(event) => setTitle(event.target.value)}
        error={errors.title}
        required
      />
      <Textarea
        label="Description"
        name="description"
        value={description}
        maxLength={5000}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Select
        label="Statut"
        name="status"
        value={status}
        onChange={(event) => setStatus(event.target.value as TaskStatus)}
      >
        {TASK_STATUSES.map((value) => (
          <option key={value} value={value}>
            {statusLabel(value)}
          </option>
        ))}
      </Select>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
