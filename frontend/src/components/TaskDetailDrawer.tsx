import { useEffect, useState } from 'react'
import { X, Calendar, Flag, Tag, Trash2 } from 'lucide-react'
import { useUpdateTask, useDeleteTask } from '../features/tasks/hooks/useTasks'
import { useUiStore } from '../store/ui'
import type { Task, Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high']
const PRIORITY_LABELS: Record<Priority, string> = {
  none: 'No Priority',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
const PRIORITY_COLORS: Record<Priority, string> = {
  none: 'text-gray-400',
  low: 'text-blue-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
}

interface Props {
  task: Task
  onClose: () => void
}

export function TaskDetailDrawer({ task, onClose }: Props) {
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const { setSelectedTaskId } = useUiStore()

  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes ?? '')
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dueAt, setDueAt] = useState(
    task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '',
  )
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>(task.task_tags.map((t) => t.tag))
  const [dirty, setDirty] = useState(false)

  // Reset when task changes
  useEffect(() => {
    setTitle(task.title)
    setNotes(task.notes ?? '')
    setPriority(task.priority)
    setDueAt(task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '')
    setTags(task.task_tags.map((t) => t.tag))
    setDirty(false)
  }, [task.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!dirty) return
    await updateTask.mutateAsync({
      id: task.id,
      input: {
        title: title.trim() || task.title,
        notes: notes.trim() || null,
        priority,
        due_at: dueAt ? new Date(dueAt).toISOString() : null,
        tags,
      },
    })
    setDirty(false)
  }

  function handleBlur() {
    if (dirty) save()
  }

  function addTag() {
    const t = tag.trim()
    if (t && !tags.includes(t)) {
      setTags((p) => [...p, t])
      setDirty(true)
    }
    setTag('')
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(task.id)
    setSelectedTaskId(null)
  }

  return (
    <aside className="w-80 shrink-0 h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-sm font-semibold text-gray-700">Details</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-5">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
            onBlur={handleBlur}
            className="w-full mt-1 text-sm font-medium text-gray-900 border-0 border-b border-gray-100 focus:border-apple-blue focus:outline-none pb-1 bg-transparent transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setDirty(true) }}
            onBlur={handleBlur}
            rows={4}
            placeholder="Add notes…"
            className="w-full mt-1 text-sm text-gray-600 placeholder-gray-300 border-0 focus:outline-none resize-none bg-transparent"
          />
        </div>

        {/* Due date */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Due Date
          </label>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => { setDueAt(e.target.value); setDirty(true) }}
            onBlur={handleBlur}
            className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition-all"
          />
          {dueAt && (
            <button
              onClick={() => { setDueAt(''); setDirty(true) }}
              className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Remove date
            </button>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <Flag className="w-3.5 h-3.5" />
            Priority
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => { setPriority(p); setDirty(true) }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  priority === p
                    ? `${PRIORITY_COLORS[p]} border-current bg-current/10`
                    : 'text-gray-400 border-gray-200 hover:border-gray-300'
                }`}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5" />
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600"
              >
                {t}
                <button
                  onClick={() => { setTags((p) => p.filter((x) => x !== t)); setDirty(true) }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag() }
            }}
            onBlur={() => { if (tag) addTag() }}
            placeholder="Add tag…"
            className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition-all w-full"
          />
        </div>

        {/* Meta */}
        <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-100">
          <p>Created {new Date(task.created_at).toLocaleString()}</p>
          <p>Updated {new Date(task.updated_at).toLocaleString()}</p>
          {task.completed_at && (
            <p>Completed {new Date(task.completed_at).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Save / Delete */}
      <div className="p-4 border-t border-gray-100 flex gap-2">
        {dirty && (
          <button
            onClick={save}
            disabled={updateTask.isPending}
            className="flex-1 py-2 bg-apple-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60"
          >
            {updateTask.isPending ? 'Saving…' : 'Save'}
          </button>
        )}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </aside>
  )
}
