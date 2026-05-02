"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const dialogs = useProjectDialogs()

  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
      />

      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 pt-12">
        <h1 className="text-2xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button onClick={dialogs.openCreate}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

      <CreateProjectDialog
        open={dialogs.dialog === "create"}
        projectName={dialogs.projectName}
        isLoading={dialogs.isLoading}
        onProjectNameChange={dialogs.setProjectName}
        onSubmit={dialogs.submit}
        onClose={dialogs.closeDialog}
      />
      <RenameProjectDialog
        open={dialogs.dialog === "rename"}
        project={dialogs.targetProject}
        projectName={dialogs.projectName}
        isLoading={dialogs.isLoading}
        onProjectNameChange={dialogs.setProjectName}
        onSubmit={dialogs.submit}
        onClose={dialogs.closeDialog}
      />
      <DeleteProjectDialog
        open={dialogs.dialog === "delete"}
        project={dialogs.targetProject}
        isLoading={dialogs.isLoading}
        onConfirm={dialogs.submit}
        onClose={dialogs.closeDialog}
      />
    </div>
  )
}
