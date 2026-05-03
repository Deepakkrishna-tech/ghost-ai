"use client"

import { useState } from "react"
import { Bot, Plus } from "lucide-react"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { ShareDialog } from "@/components/editor/share-dialog"
import { Button } from "@/components/ui/button"
import { useProjectActions, type Project } from "@/hooks/use-project-actions"
import { cn } from "@/lib/utils"

interface EditorShellProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProject?: Project
  isOwner?: boolean
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  activeProject,
  isOwner = false,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <div className="workspace-shell relative h-screen overflow-hidden text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={activeProject?.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
        onShareProject={activeProject ? () => setIsShareOpen(true) : undefined}
      />

      {/* Three-column layout below the fixed navbar */}
      <div className="absolute inset-x-0 bottom-0 top-12 flex overflow-hidden">
        {/* Left sidebar — flex child, width animates on toggle */}
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
            isSidebarOpen ? "w-64" : "w-0"
          )}
        >
          <ProjectSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            ownedProjects={ownedProjects}
            sharedProjects={sharedProjects}
            activeProjectId={activeProject?.id}
            onCreateProject={actions.openCreate}
            onRenameProject={actions.openRename}
            onDeleteProject={actions.openDelete}
          />
        </div>

        {activeProject ? (
          <div className="flex flex-1 min-h-0 min-w-0 gap-3 p-3">
            <section className="workspace-canvas min-w-0 flex-1 overflow-hidden rounded-2xl">
              <CanvasWrapper roomId={activeProject.id} />
            </section>

            {isAiSidebarOpen && (
              <aside className="workspace-sidebar hidden w-80 shrink-0 flex-col rounded-2xl border border-[color:var(--border-default)] p-4 md:flex">
                <div className="flex items-center gap-3 border-b border-[color:var(--workspace-panel-border)] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-dim">
                    <Bot className="h-4 w-4 text-ai-text" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-[0.02em] text-copy-primary">
                      AI Copilot
                    </h2>
                    <p className="text-xs text-copy-muted">Placeholder panel</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 py-4">
                  <div className="rounded-2xl border border-[color:var(--workspace-panel-border)] bg-[rgba(255,255,255,0.035)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim">
                        <Bot className="h-4 w-4 text-ai-text" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-copy-primary">
                          Chat surface pending
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-copy-muted">
                          The toggle is wired. Messaging and generation are intentionally
                          out of scope here.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--workspace-panel-border)] bg-[rgba(255,255,255,0.02)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copy-faint">
                      Future hooks
                    </p>
                    <p className="mt-3 text-xs leading-5 text-copy-muted">
                      Prompt composer, run status, and architecture guidance will attach
                      to this sidebar.
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        ) : (
          <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            <h1 className="text-xl font-semibold tracking-[0.02em] text-copy-primary">
              Create a project or open an existing one
            </h1>
            <p className="text-sm text-copy-muted">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>
            <Button className="workspace-primary-button" onClick={actions.openCreate}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </main>
        )}
      </div>

      <CreateProjectDialog
        open={actions.dialog === "create"}
        projectName={actions.projectName}
        roomId={actions.roomId}
        isLoading={actions.isLoading}
        onProjectNameChange={actions.setProjectName}
        onSubmit={actions.submit}
        onClose={actions.closeDialog}
      />
      <RenameProjectDialog
        open={actions.dialog === "rename"}
        project={actions.targetProject}
        projectName={actions.projectName}
        isLoading={actions.isLoading}
        onProjectNameChange={actions.setProjectName}
        onSubmit={actions.submit}
        onClose={actions.closeDialog}
      />
      <DeleteProjectDialog
        open={actions.dialog === "delete"}
        project={actions.targetProject}
        isLoading={actions.isLoading}
        onConfirm={actions.submit}
        onClose={actions.closeDialog}
      />
      {activeProject && (
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          projectId={activeProject.id}
          isOwner={isOwner}
        />
      )}
    </div>
  )
}
