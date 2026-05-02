"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex min-h-screen items-center justify-center px-6 pt-12">
        <div className="max-w-xl rounded-3xl border border-surface-border bg-surface px-8 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-copy-muted">
            Editor Workspace
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-copy-primary">
            Ready for the collaborative canvas.
          </h1>
          <p className="mt-3 text-sm leading-6 text-copy-secondary">
            The auth layer is now wired in. This shell gives the redirect target
            a real destination while the editor feature continues to grow.
          </p>
        </div>
      </main>
    </div>
  )
}
