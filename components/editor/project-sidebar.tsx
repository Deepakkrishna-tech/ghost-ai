"use client"

import Link from "next/link"
import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/hooks/use-project-actions"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProjectId?: string
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const defaultTab = sharedProjects.some((project) => project.id === activeProjectId)
    ? "shared"
    : "my-projects"

  return (
    <aside
      className="workspace-sidebar flex h-full w-64 shrink-0 flex-col border-r border-[color:var(--border-default)] p-4"
    >
        <div className="flex shrink-0 items-center justify-between pb-4">
          <span className="text-sm font-semibold tracking-[0.02em] text-copy-primary">
            Projects
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-copy-secondary" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue={defaultTab} className="flex flex-1 flex-col">
            <TabsList className="w-full rounded-xl border border-[color:var(--workspace-panel-border)] bg-[rgba(255,255,255,0.04)] p-1">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-4 flex-1">
              {ownedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <FolderOpen className="h-8 w-8 text-copy-faint" />
                  <p className="text-sm text-copy-muted">No projects yet</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-4 flex-1">
              {sharedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Users className="h-8 w-8 text-copy-faint" />
                  <p className="text-sm text-copy-muted">No shared projects</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 pt-4">
          <Button
            className="workspace-sidebar-button w-full"
            size="sm"
            onClick={onCreateProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
    </aside>
  )
}

interface ProjectItemProps {
  project: Project
  isActive?: boolean
  onRename?: (project: Project) => void
  onDelete?: (project: Project) => void
}

function ProjectItem({ project, isActive = false, onRename, onDelete }: ProjectItemProps) {
  return (
    <li
      className={cn(
        "group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--workspace-panel-hover)]",
        isActive && "bg-accent-dim ring-1 ring-[color:rgba(0,200,212,0.18)]"
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <FolderOpen
          className={cn(
            "h-4 w-4 shrink-0 text-copy-muted",
            isActive && "text-brand"
          )}
        />
        <span
          className={cn(
            "flex-1 truncate text-sm text-copy-secondary",
            isActive && "font-medium text-copy-primary"
          )}
        >
          {project.name}
        </span>
      </Link>
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
