import { db } from '../../lib/db'
import { notFound, forbidden } from '../../lib/errors'
import type { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from './schema'

export async function listTasks(userId: string, query: ListTasksQuery) {
  const now = new Date()
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  let q = db
    .from('tasks')
    .select('*, task_tags(tag)')
    .eq('creator_id', userId)

  const { view, list_id, search } = query

  if (search) {
    q = q.ilike('title', `%${search}%`)
  }

  switch (view) {
    case 'today':
      q = q
        .lte('due_at', todayEnd.toISOString())
        .not('due_at', 'is', null)
        .is('completed_at', null)
      break
    case 'scheduled':
      q = q.not('due_at', 'is', null).is('completed_at', null)
      break
    case 'completed':
      q = q.not('completed_at', 'is', null)
      break
    case 'all':
      q = q.is('completed_at', null)
      break
    default: // inbox
      if (list_id) {
        q = q.eq('list_id', list_id).is('completed_at', null)
      } else {
        q = q.is('list_id', null).is('completed_at', null)
      }
  }

  const { data, error } = await q.order('position').order('created_at')
  if (error) throw error
  return data
}

export async function getTaskById(taskId: string, userId: string) {
  const { data, error } = await db
    .from('tasks')
    .select('*, task_tags(tag)')
    .eq('id', taskId)
    .single()

  if (error || !data) throw notFound('Task')
  if (data.creator_id !== userId) throw forbidden()
  return data
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const { tags = [], ...taskData } = input

  const { data: task, error } = await db
    .from('tasks')
    .insert({ creator_id: userId, ...taskData })
    .select()
    .single()

  if (error) throw error

  if (tags.length > 0) {
    const tagRows = tags.map((tag) => ({ task_id: task.id, tag }))
    const { error: tagError } = await db.from('task_tags').insert(tagRows)
    if (tagError) throw tagError
  }

  return getTaskById(task.id, userId)
}

export async function updateTask(
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
) {
  await getTaskById(taskId, userId) // ownership check

  const { tags, ...taskData } = input

  if (Object.keys(taskData).length > 0) {
    const { error } = await db
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)

    if (error) throw error
  }

  if (tags !== undefined) {
    await db.from('task_tags').delete().eq('task_id', taskId)
    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({ task_id: taskId, tag }))
      const { error } = await db.from('task_tags').insert(tagRows)
      if (error) throw error
    }
  }

  return getTaskById(taskId, userId)
}

export async function completeTask(taskId: string, userId: string) {
  await getTaskById(taskId, userId) // ownership check

  const { data, error } = await db
    .from('tasks')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uncompleteTask(taskId: string, userId: string) {
  await getTaskById(taskId, userId)

  const { data, error } = await db
    .from('tasks')
    .update({ completed_at: null })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId: string, userId: string) {
  await getTaskById(taskId, userId) // ownership check

  const { error } = await db.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}
