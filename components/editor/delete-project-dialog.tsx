"use client"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import type { MockProject } from "@/hooks/use-project-dialogs"

interface DeleteProjectDialogProps {
  open: boolean
  project: MockProject | null
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  project,
  isLoading,
  onConfirm,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      title="Delete project"
      description={
        project
          ? `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
          : undefined
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            Delete
          </Button>
        </>
      }
    />
  )
}
