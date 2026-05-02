"use client"

import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditorDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  footer?: ReactNode
  children?: ReactNode
}

/**
 * Renders a modal dialog with a title, optional description, optional footer, and custom content.
 *
 * @param open - Controls whether the dialog is visible
 * @param onOpenChange - Callback invoked with the new open state when visibility changes
 * @param title - Text displayed as the dialog title
 * @param description - Optional text displayed below the title
 * @param footer - Optional content rendered in the dialog footer
 * @param children - Content rendered between the header and footer
 * @returns The rendered dialog element
 */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl border-surface-border bg-elevated max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
