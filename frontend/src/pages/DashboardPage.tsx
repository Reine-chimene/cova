import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskForm, type TaskFormValues } from '../components/tasks/TaskForm'
import { TaskToolbar } from '../components/tasks/TaskToolbar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { ApiError } from '../services/api'
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from '../services/taskService'
import type { StatusFilter, Task } from '../types/task'

export function DashboardPage() {
  const navigate = useNavigate()
  const { email, logout } = useAuth()
  const { showToast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const status = statusFilter === 'ALL' ? undefined : statusFilter
      const data = await fetchTasks(status)
      setTasks(data)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Impossible de charger les tâches.'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast, statusFilter])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return tasks
    }
    return tasks.filter((task) => {
      const title = task.title.toLowerCase()
      const description = (task.description ?? '').toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }, [search, tasks])

  async function handleCreate(values: TaskFormValues) {
    setCreating(true)
    try {
      await createTask(values)
      setCreateOpen(false)
      showToast('Tâche créée.', 'success')
      await loadTasks()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Impossible de créer la tâche.'
      showToast(message, 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdate(values: TaskFormValues) {
    if (!editTask) {
      return
    }
    setUpdating(true)
    try {
      await updateTask(editTask.id, values)
      setEditTask(null)
      showToast('Tâche mise à jour.', 'success')
      await loadTasks()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Impossible de mettre à jour la tâche.'
      showToast(message, 'error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(
      `Supprimer « ${task.title} » ? Cette action est irréversible.`,
    )
    if (!confirmed) {
      return
    }

    setDeletingId(task.id)
    try {
      await deleteTask(task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
      showToast('Tâche supprimée.', 'success')
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Impossible de supprimer la tâche.'
      showToast(message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              COVA Task Manager
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
            {email ? (
              <p className="text-sm text-slate-600">Connecté en tant que {email}</p>
            ) : null}
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <TaskToolbar
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onCreateClick={() => setCreateOpen(true)}
        />

        {loading ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
            Chargement des tâches…
          </p>
        ) : filteredTasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
            Aucune tâche trouvée. Créez votre première tâche pour commencer.
          </p>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                deleting={deletingId === task.id}
                onEdit={setEditTask}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Modal title="Nouvelle tâche" open={createOpen} onClose={() => setCreateOpen(false)}>
        <TaskForm
          submitLabel="Créer la tâche"
          loading={creating}
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal title="Modifier la tâche" open={Boolean(editTask)} onClose={() => setEditTask(null)}>
        <TaskForm
          initialTask={editTask ?? undefined}
          submitLabel="Enregistrer"
          loading={updating}
          onCancel={() => setEditTask(null)}
          onSubmit={handleUpdate}
        />
      </Modal>
    </div>
  )
}
