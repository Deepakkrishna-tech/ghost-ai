"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { Button } from "@/components/ui/button"
import { useProjectActions, type Project } from "@/hooks/use-project-actions"

interface EditorShellProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorShell({ ownedProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const actions = useProjectActions()

  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onCreateProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 pt-12">
        <h1 className="text-2xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button onClick={actions.openCreate}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

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
    </div>
  )
}
