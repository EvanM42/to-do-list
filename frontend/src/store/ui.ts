import { create } from 'zustand'
import type { ViewType } from '../lib/types'

interface UiState {
  activeView: ViewType
  activeListId: string | null
  selectedTaskId: string | null
  sidebarOpen: boolean
  setActiveView: (view: ViewType) => void
  setActiveListId: (id: string | null) => void
  setSelectedTaskId: (id: string | null) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  activeView: 'inbox',
  activeListId: null,
  selectedTaskId: null,
  sidebarOpen: true,
  setActiveView: (view) => set({ activeView: view, activeListId: null, selectedTaskId: null }),
  setActiveListId: (id) => set({ activeListId: id, activeView: 'inbox', selectedTaskId: null }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
