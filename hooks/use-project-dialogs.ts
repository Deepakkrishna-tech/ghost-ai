"use client"

import { useState } from "react"

export interface MockProject {
  id: string
  name: string
  slug: string
  owned: boolean
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", owned: true },
  { id: "2", name: "Auth Service", slug: "auth-service", owned: true },
  { id: "3", name: "Marketing Site", slug: "marketing-site", owned: false },
]

export type DialogType = "create" | "rename" | "delete" | null

export interface ProjectDialogsHook {
  dialog: DialogType
  projectName: string
  targetProject: MockProject | null
  isLoading: boolean
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  closeDialog: () => void
  setProjectName: (name: string) => void
  submit: () => void
}

export function useProjectDialogs(): ProjectDialogsHook {
  const [dialog, setDialog] = useState<DialogType>(null)
  const [projectName, setProjectName] = useState("")
  const [targetProject, setTargetProject] = useState<MockProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function openCreate() {
    setProjectName("")
    setTargetProject(null)
    setDialog("create")
  }

  function openRename(project: MockProject) {
    setProjectName(project.name)
    setTargetProject(project)
    setDialog("rename")
  }

  function openDelete(project: MockProject) {
    setTargetProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog(null)
    setProjectName("")
    setTargetProject(null)
  }

  function submit() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      closeDialog()
    }, 400)
  }

  return {
    dialog,
    projectName,
    targetProject,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setProjectName,
    submit,
  }
}
