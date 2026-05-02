"use client"

import type { KeyboardEvent } from "react"
import { EditorDialog } from "@/components/editor/editor-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { MockProject } from "@/hooks/use-project-dialogs"

interface RenameProjectDialogProps {
  open: boolean
  project: MockProject | null
  projectName: string
  isLoading: boolean
  onProjectNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  project,
  projectName,
  isLoading,
  onProjectNameChange,
  onSubmit,
  onClose,
}: RenameProjectDialogProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && projectName.trim()) {
      onSubmit()
    }
  }

  return (
    <EditorDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      title="Rename project"
      description={project ? `Renaming "${project.name}"` : undefined}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!projectName.trim() || isLoading}
          >
            Rename
          </Button>
        </>
      }
    >
      <Input
        placeholder="Project name"
        value={projectName}
        onChange={(e) => onProjectNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </EditorDialog>
  )
}
