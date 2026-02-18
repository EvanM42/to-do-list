import { useState } from 'react'
import { Calendar, Flag, Trash2, ChevronRight } from 'lucide-react'
import { useCompleteTask, useDeleteTask } from '../features/tasks/hooks/useTasks'
import { useUiStore } from '../store/ui'
import type { Task, Priority } from '../lib/types'

const PRIORITY_COLORS: Record<Priority, string> = {
  none: 'border-gray-300',
  low: 'border-blue-400',
  medium: 'border-yellow-400',
  high: 'border-red-500',
}

const PRIORITY_DOT: Record<Priority, string> = {
  none: '',
  low: 'text-blue-400',
  medium: 'text-yellow-400',
  high: 'text-red-500',
}

function formatDue(iso: string): { text: string; overdue: boolean } {
  const d = new Date(iso)
  const now = new Date()
  const overdue = d < now
  const isToday = d.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()

  let text: string
  if (isToday) {
    text = `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (isTomorrow) {
    text = 'Tomorrow'
  } else {
    text = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
  return { text, overdue }
}

interface Props {
  task: Task
}

export function TaskItem({ task }: Props) {
  const [hovered, setHovered] = useState(false)
  const completeTask = useCompleteTask()
  const deleteTask = useDeleteTask()
  const { setSelectedTaskId, selectedTaskId } = useUiStore()

  const isCompleted = !!task.completed_at
  const isSelected = selectedTaskId === task.id
  const due = task.due_at ? formatDue(task.due_at) : null

  function handleComplete(e: React.MouseEvent) {
    e.stopPropagation()
    completeTask.mutate({ id: task.id, completed: isCompleted })
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    deleteTask.mutate(task.id)
  }

  return (
    <div
      onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
        isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/70'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-apple-green border-apple-green'
            : PRIORITY_COLORS[task.priority] + ' hover:border-apple-green'
        }`}
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {task.title}
          {task.priority !== 'none' && (
            <Flag className={`inline w-3 h-3 ml-1.5 mb-0.5 ${PRIORITY_DOT[task.priority]}`} />
          )}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {due && (
            <span
              className={`flex items-center gap-0.5 text-xs ${
                due.overdue && !isCompleted ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {due.text}
            </span>
          )}
          {task.task_tags.map(({ tag }) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {task.notes && (
            <span className="text-xs text-gray-400 truncate max-w-40">{task.notes}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {(hovered || isSelected) && (
          <button
            onClick={handleDelete}
            className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <ChevronRight
          className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-apple-blue' : 'text-gray-300'}`}
        />
      </div>
    </div>
  )
}
