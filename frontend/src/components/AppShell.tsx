import { Menu } from 'lucide-react'
import { SidebarNav } from './SidebarNav'
import { TaskView } from './TaskView'
import { useUiStore } from '../store/ui'

export function AppShell() {
  const { sidebarOpen, toggleSidebar } = useUiStore()

  return (
    <div className="h-screen flex flex-col bg-apple-bg overflow-hidden">
      {/* Top bar (mobile) */}
      <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Reminders</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'flex' : 'hidden'
          } md:flex shrink-0 h-full`}
        >
          <SidebarNav />
        </div>

        {/* Main */}
        <TaskView />
      </div>
    </div>
  )
}
