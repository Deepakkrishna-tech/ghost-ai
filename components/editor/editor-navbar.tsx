"use client"

import { UserButton } from "@clerk/nextjs"
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onShareProject?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShareProject,
}: EditorNavbarProps) {
  const showWorkspaceActions = Boolean(projectName)

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-[color:var(--workspace-panel-border)] bg-[rgba(11,15,20,0.72)] px-4 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl">
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
      <div className="min-w-0 flex-1 px-3">
        {projectName && (
          <div className="truncate text-sm font-semibold tracking-[0.02em] text-copy-primary">
            {projectName}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {showWorkspaceActions && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-copy-secondary hover:bg-[var(--workspace-panel-hover)] hover:text-copy-primary"
              onClick={onShareProject}
              aria-label="Share project"
            >
              <Share2 className="h-4 w-4 text-copy-secondary" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAiSidebar}
              aria-label="Toggle AI sidebar"
            >
              {isAiSidebarOpen ? (
                <PanelRightClose className="h-5 w-5 text-ai-text" />
              ) : (
                <PanelRightOpen className="h-5 w-5 text-ai-text" />
              )}
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </nav>
  )
}
