export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus
}

export interface UpdateTaskRequest {
  title: string
  description?: string
  status: TaskStatus
}

export type StatusFilter = 'ALL' | TaskStatus
