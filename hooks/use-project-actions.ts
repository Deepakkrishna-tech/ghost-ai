"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface Project {
  id: string
  name: string
  ownerId: string
}

export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export interface ProjectActionsHook {
  dialog: DialogType
  projectName: string
  roomId: string
  targetProject: Project | null
  isLoading: boolean
  error: string | null
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
  closeDialog: () => void
  setProjectName: (name: string) => void
  submit: () => void
}

export function useProjectActions(): ProjectActionsHook {
  const router = useRouter()
  const pathname = usePathname()

  const [dialog, setDialog] = useState<DialogType>(null)
  const [projectName, setProjectName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slug = toSlug(projectName)
  const roomId = slug ? `${slug}-${suffix}` : suffix

  function openCreate() {
    setProjectName("")
    setSuffix(generateSuffix())
    setTargetProject(null)
    setDialog("create")
  }

  function openRename(project: Project) {
    setProjectName(project.name)
    setTargetProject(project)
    setDialog("rename")
  }

  function openDelete(project: Project) {
    setTargetProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog(null)
    setProjectName("")
    setSuffix("")
    setTargetProject(null)
  }

  async function createProject() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName.trim(), id: roomId }),
    })
    if (!res.ok) throw new Error("Failed to create project")
    const project: Project = await res.json()
    closeDialog()
    router.push(`/editor/${project.id}`)
  }

  async function renameProject() {
    if (!targetProject) return
    const res = await fetch(`/api/projects/${targetProject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName.trim() }),
    })
    if (!res.ok) throw new Error("Failed to rename project")
    closeDialog()
    router.refresh()
  }

  async function deleteProject() {
    if (!targetProject) return
    const res = await fetch(`/api/projects/${targetProject.id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete project")
    closeDialog()
    if (pathname.includes(targetProject.id)) {
      router.push("/editor")
    } else {
      router.refresh()
    }
  }

  function submit() {
    setIsLoading(true)
    setError(null)
    const action =
      dialog === "create"
        ? createProject
        : dialog === "rename"
          ? renameProject
          : dialog === "delete"
            ? deleteProject
            : null

    if (!action) {
      setIsLoading(false)
      return
    }

    action()
      .catch((err: Error) => {
        setError(err.message || "An error occurred")
      })
      .finally(() => setIsLoading(false))
  }

  return {
    dialog,
    projectName,
    roomId,
    targetProject,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setProjectName,
    submit,
  }
}
