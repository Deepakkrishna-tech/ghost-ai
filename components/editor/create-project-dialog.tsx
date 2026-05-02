"use client"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateProjectDialogProps {
  open: boolean
  projectName: string
  roomId: string
  isLoading: boolean
  onProjectNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  projectName,
  roomId,
  isLoading,
  onProjectNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
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
        {roomId && (
          <p className="text-xs text-copy-muted">
            Room ID:{" "}
            <span className="font-mono text-copy-secondary">{roomId}</span>
          </p>
        )}
      </div>
    </EditorDialog>
  )
}
