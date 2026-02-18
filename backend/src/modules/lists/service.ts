import { db } from '../../lib/db'
import { notFound, forbidden } from '../../lib/errors'
import type { CreateListInput, UpdateListInput } from './schema'

export async function getUserLists(userId: string) {
  const { data, error } = await db
    .from('lists')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getListById(listId: string, userId: string) {
  const { data, error } = await db
    .from('lists')
    .select('*')
    .eq('id', listId)
    .single()

  if (error || !data) throw notFound('List')
  if (data.owner_id !== userId) throw forbidden()
  return data
}

export async function createList(userId: string, input: CreateListInput) {
  const { data, error } = await db
    .from('lists')
    .insert({ owner_id: userId, ...input })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateList(
  listId: string,
  userId: string,
  input: UpdateListInput,
) {
  await getListById(listId, userId) // ownership check

  const { data, error } = await db
    .from('lists')
    .update(input)
    .eq('id', listId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteList(listId: string, userId: string) {
  await getListById(listId, userId) // ownership check

  const { error } = await db.from('lists').delete().eq('id', listId)
  if (error) throw error
}
