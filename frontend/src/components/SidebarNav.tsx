import { useState } from 'react'
import {
  Inbox,
  Sun,
  CalendarDays,
  List,
  CheckCircle2,
  Plus,
  Trash2,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useUiStore } from '../store/ui'
import { useLists, useCreateList, useDeleteList } from '../features/lists/hooks/useLists'
import { supabase } from '../lib/supabase'
import type { ViewType } from '../lib/types'

const FIXED_VIEWS: { id: ViewType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'today', label: 'Today', icon: <Sun className="w-4 h-4" />, color: 'bg-yellow-500' },
  { id: 'scheduled', label: 'Scheduled', icon: <CalendarDays className="w-4 h-4" />, color: 'bg-red-500' },
  { id: 'all', label: 'All', icon: <List className="w-4 h-4" />, color: 'bg-gray-500' },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-green-500' },
]

export function SidebarNav() {
  const { activeView, activeListId, setActiveView, setActiveListId } = useUiStore()
  const { data: lists = [] } = useLists()
  const createList = useCreateList()
  const deleteList = useDeleteList()
  const [newListTitle, setNewListTitle] = useState('')
  const [addingList, setAddingList] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault()
    if (!newListTitle.trim()) return
    await createList.mutateAsync({ title: newListTitle.trim() })
    setNewListTitle('')
    setAddingList(false)
  }

  return (
    <aside className="w-60 shrink-0 h-full bg-apple-sidebar border-r border-gray-200/80 flex flex-col select-none">
      {/* Fixed views */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">
          Views
        </p>

        {FIXED_VIEWS.map(({ id, label, icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors group ${
              activeView === id && !activeListId
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
            }`}
          >
            <span className={`${color} text-white w-7 h-7 rounded-lg flex items-center justify-center shrink-0`}>
              {icon}
            </span>
            {label}
          </button>
        ))}

        {/* Custom lists */}
        <div className="pt-3">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              My Lists
            </p>
            <button
              onClick={() => setAddingList(true)}
              className="text-gray-400 hover:text-apple-blue transition-colors"
              aria-label="Add list"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {lists.map((list) => (
            <div key={list.id} className="group flex items-center">
              <button
                onClick={() => setActiveListId(list.id)}
                className={`flex-1 flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeListId === list.id
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: list.color }}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="truncate">{list.title}</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete list "${list.title}"?`)) {
                    deleteList.mutate(list.id)
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-500 transition-all mr-1"
                aria-label={`Delete ${list.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* New list form */}
          {addingList && (
            <form onSubmit={handleCreateList} className="mt-1">
              <input
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { setAddingList(false); setNewListTitle('') }
                }}
                placeholder="List name…"
                className="w-full px-2 py-1.5 rounded-lg text-sm border border-apple-blue/50 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 bg-white"
              />
            </form>
          )}
        </div>
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-200/80">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-white/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
