import type { CreateTaskRequest, Task, TaskStatus, UpdateTaskRequest } from '../types/task'
import { apiRequest } from './api'

export async function fetchTasks(status?: TaskStatus): Promise<Task[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiRequest<Task[]>(`/api/tasks${query}`)
}

export async function createTask(request: CreateTaskRequest): Promise<Task> {
  return apiRequest<Task>('/api/tasks', {
    method: 'POST',
    body: request,
  })
}

export async function updateTask(id: number, request: UpdateTaskRequest): Promise<Task> {
  return apiRequest<Task>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: request,
  })
}

export async function deleteTask(id: number): Promise<void> {
  await apiRequest<void>(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
}
