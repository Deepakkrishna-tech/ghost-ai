"use client"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

interface CreateProjectDialogProps {
  open: boolean
  projectName: string
  isLoading: boolean
  onProjectNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  projectName,
  isLoading,
  onProjectNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const slug = toSlug(projectName)

  return (
    <EditorDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      title="Create project"
      description="Give your architecture workspace a name."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!projectName.trim() || isLoading}
          >
            Create
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Project name"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          autoFocus
        />
        {slug && (
          <p className="text-xs text-copy-muted">
            Slug:{" "}
            <span className="font-mono text-copy-secondary">{slug}</span>
          </p>
        )}
      </div>
    </EditorDialog>
  )
}
