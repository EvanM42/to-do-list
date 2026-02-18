export type Priority = 'none' | 'low' | 'medium' | 'high'

export interface Task {
  id: string
  list_id: string | null
  creator_id: string
  title: string
  notes: string | null
  priority: Priority
  due_at: string | null
  completed_at: string | null
  position: number
  created_at: string
  updated_at: string
  task_tags: { tag: string }[]
}

export interface List {
  id: string
  owner_id: string
  title: string
  color: string
  created_at: string
  updated_at: string
}

export type ViewType = 'inbox' | 'today' | 'scheduled' | 'all' | 'completed'

export interface CreateTaskInput {
  title: string
  notes?: string
  list_id?: string | null
  priority?: Priority
  due_at?: string | null
  tags?: string[]
}

export interface UpdateTaskInput {
  title?: string
  notes?: string | null
  list_id?: string | null
  priority?: Priority
  due_at?: string | null
  tags?: string[]
}

export interface CreateListInput {
  title: string
  color?: string
}

export interface UpdateListInput {
  title?: string
  color?: string
}
