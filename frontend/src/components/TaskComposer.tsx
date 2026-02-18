import { useState, useRef, useEffect } from 'react'
import { Plus, Calendar, Flag, Tag, X } from 'lucide-react'
import { useCreateTask } from '../features/tasks/hooks/useTasks'
import { useUiStore } from '../store/ui'
import type { Priority } from '../lib/types'

const PRIORITY_LABELS: Record<Priority, { label: string; color: string }> = {
  none: { label: 'No Priority', color: 'text-gray-400' },
  low: { label: 'Low', color: 'text-blue-500' },
  medium: { label: 'Medium', color: 'text-yellow-500' },
  high: { label: 'High', color: 'text-red-500' },
}

interface Props {
  defaultListId?: string | null
}

export function TaskComposer({ defaultListId }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const createTask = useCreateTask()
  const { activeView } = useUiStore()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function reset() {
    setTitle('')
    setNotes('')
    setDueAt('')
    setPriority('none')
    setTags([])
    setTag('')
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    await createTask.mutateAsync({
      title: title.trim(),
      notes: notes.trim() || undefined,
      list_id: defaultListId ?? null,
      priority,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      tags,
    })

    reset()
  }

  function addTag() {
    const t = tag.trim()
    if (t && !tags.includes(t)) setTags((p) => [...p, t])
    setTag('')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-apple-blue hover:text-apple-blue transition-colors text-sm font-medium"
        aria-label="Add task"
      >
        <Plus className="w-4 h-4" />
        {activeView === 'today' ? 'Add to Today' : 'Add Reminder'}
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-apple-blue/40 bg-white shadow-card overflow-hidden"
    >
      <div className="p-4 space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && reset()}
          placeholder="Task title"
          className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none resize-none"
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTags((p) => p.filter((x) => x !== t))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        {/* Due date */}
        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer hover:text-apple-blue transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-0 opacity-0 absolute"
          />
          {dueAt ? new Date(dueAt).toLocaleDateString() : 'Due date'}
        </label>

        {/* Priority picker */}
        <div className="relative group">
          <button
            type="button"
            className={`flex items-center gap-1.5 text-xs ${PRIORITY_LABELS[priority].color} hover:opacity-80 transition-opacity`}
          >
            <Flag className="w-3.5 h-3.5" />
            {priority !== 'none' ? PRIORITY_LABELS[priority].label : 'Priority'}
          </button>
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 min-w-28">
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${PRIORITY_LABELS[p].color} ${priority === p ? 'font-semibold' : ''}`}
              >
                {PRIORITY_LABELS[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag input */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Tag className="w-3.5 h-3.5" />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag() }
            }}
            placeholder="Tag…"
            className="w-16 focus:outline-none placeholder-gray-400 bg-transparent"
          />
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={reset}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || createTask.isPending}
          className="px-3 py-1 bg-apple-blue text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  )
}
