import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useUiStore } from '../store/ui'
import { useTasks } from '../features/tasks/hooks/useTasks'
import { useLists } from '../features/lists/hooks/useLists'
import { TaskList } from './TaskList'
import { TaskComposer } from './TaskComposer'
import { TaskDetailDrawer } from './TaskDetailDrawer'
import type { Task } from '../lib/types'

const VIEW_TITLES: Record<string, string> = {
  inbox: 'Inbox',
  today: 'Today',
  scheduled: 'Scheduled',
  all: 'All',
  completed: 'Completed',
}

const VIEW_EMPTY: Record<string, string> = {
  inbox: 'Your inbox is clear. Add a reminder below.',
  today: 'Nothing due today. Enjoy your day!',
  scheduled: 'No scheduled tasks.',
  all: 'No active tasks.',
  completed: 'Nothing completed yet.',
}

export function TaskView() {
  const { activeView, activeListId, selectedTaskId } = useUiStore()
  const { data: lists = [] } = useLists()
  const activeList = lists.find((l) => l.id === activeListId) ?? null

  const [search, setSearch] = useState('')

  const { data: tasks = [], isLoading, isError } = useTasks(
    activeView,
    activeListId ?? undefined,
  )

  const title = activeListId ? (activeList?.title ?? 'List') : VIEW_TITLES[activeView]

  const filteredTasks = search.trim()
    ? tasks.filter((t: Task) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.notes?.toLowerCase().includes(search.toLowerCase()),
      )
    : tasks

  const selectedTask = selectedTaskId
    ? tasks.find((t: Task) => t.id === selectedTaskId) ?? null
    : null

  const showComposer = activeView !== 'completed'

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {activeList && (
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: activeList.color }}
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 inline">{title}</h1>
            {tasks.length > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-400">{tasks.length}</span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
            Failed to load tasks. Please refresh.
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            emptyMessage={
              search ? 'No tasks match your search.' : VIEW_EMPTY[activeView] ?? 'No tasks.'
            }
          />
        )}

        {/* Composer */}
        {showComposer && (
          <div className="mt-4">
            <TaskComposer defaultListId={activeListId} />
          </div>
        )}
      </main>

      {/* Detail drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={() => useUiStore.getState().setSelectedTaskId(null)}
        />
      )}
    </div>
  )
}
