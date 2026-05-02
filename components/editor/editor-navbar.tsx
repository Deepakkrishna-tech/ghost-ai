"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

/**
 * Renders the editor's fixed top navigation bar with a sidebar toggle button.
 *
 * @param isSidebarOpen - Whether the sidebar is currently open; controls which icon is shown.
 * @param onToggleSidebar - Handler invoked when the toggle button is clicked.
 * @returns The navigation bar element containing the sidebar toggle control and layout placeholders.
 */
export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center bg-surface border-b border-surface-border px-3">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 text-copy-secondary" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 text-copy-secondary" />
          )}
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center" />
    </nav>
  )
}
