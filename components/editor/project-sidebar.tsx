"use client"

import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { MOCK_PROJECTS, type MockProject } from "@/hooks/use-project-dialogs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: () => void
  onRenameProject: (project: MockProject) => void
  onDeleteProject: (project: MockProject) => void
}

const ownedProjects = MOCK_PROJECTS.filter((p) => p.owned)
const sharedProjects = MOCK_PROJECTS.filter((p) => !p.owned)

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-12 z-30 flex h-[calc(100vh-3rem)] w-72 flex-col",
          "bg-elevated border-r border-surface-border",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-medium text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-copy-secondary" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-2 flex-1">
              {ownedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <FolderOpen className="h-8 w-8 text-copy-faint" />
                  <p className="text-sm text-copy-muted">No projects yet</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-2 flex-1">
              {sharedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Users className="h-8 w-8 text-copy-faint" />
                  <p className="text-sm text-copy-muted">No shared projects</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button className="w-full" size="sm" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectItemProps {
  project: MockProject
  onRename?: (project: MockProject) => void
  onDelete?: (project: MockProject) => void
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <li className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-subtle cursor-pointer">
      <FolderOpen className="h-4 w-4 shrink-0 text-copy-muted" />
      <span className="flex-1 truncate text-sm text-copy-secondary">
        {project.name}
      </span>
      {onRename && onDelete && (
        <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${project.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onRename(project)
            }}
          >
            <Pencil className="h-3 w-3 text-copy-muted" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${project.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project)
            }}
          >
            <Trash2 className="h-3 w-3 text-copy-muted" />
          </Button>
        </div>
      )}
    </li>
  )
}
