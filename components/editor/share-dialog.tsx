"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, Copy, Loader2, Mail, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Collaborator {
  id: string
  email: string
  displayName: string | null
  imageUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  isOwner: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCollaborators = useCallback(async () => {
    setIsLoadingList(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!res.ok) throw new Error("Failed to load collaborators")
      const data: Collaborator[] = await res.json()
      setCollaborators(data)
    } catch {
      setError("Could not load collaborators.")
    } finally {
      setIsLoadingList(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      fetchCollaborators()
      setEmailInput("")
      setError(null)
    }
  }, [open, fetchCollaborators])

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())

  async function invite() {
    setIsInviting(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? "Failed to invite collaborator")
      }
      const collaborator: Collaborator = await res.json()
      setCollaborators((prev) => [...prev, collaborator])
      setEmailInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite collaborator")
    } finally {
      setIsInviting(false)
    }
  }

  async function remove(id: string) {
    setRemovingId(id)
    setError(null)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${id}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Failed to remove collaborator")
      setCollaborators((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove collaborator")
    } finally {
      setRemovingId(null)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(
      `${window.location.origin}/editor/${projectId}`
    )
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="rounded-3xl border-surface-border bg-elevated max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Share project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            {isOwner
              ? "Invite collaborators by email to give them access."
              : "Collaborators with access to this project."}
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValidEmail && !isInviting) invite()
              }}
              disabled={isInviting}
            />
            <Button
              onClick={invite}
              disabled={!isValidEmail || isInviting}
              className="shrink-0"
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Invite
            </Button>
          </div>
        )}

        {error && (
          <p className="text-xs text-[color:var(--state-error)]">{error}</p>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-copy-faint">
            {isLoadingList
              ? "Loading…"
              : collaborators.length === 0
                ? "No collaborators yet"
                : "Collaborators"}
          </p>

          {isLoadingList ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-copy-muted" />
            </div>
          ) : (
            <ScrollArea className="max-h-56">
              <ul className="space-y-0.5">
                {collaborators.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[color:var(--bg-subtle)]"
                  >
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt={c.displayName ?? c.email}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--bg-subtle)] text-xs font-semibold text-copy-secondary">
                        {(c.displayName ?? c.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {c.displayName && (
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {c.displayName}
                        </p>
                      )}
                      <p className="truncate text-xs text-copy-muted">{c.email}</p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 rounded-xl text-copy-muted hover:text-[color:var(--state-error)]"
                        onClick={() => remove(c.id)}
                        disabled={removingId === c.id}
                        aria-label={`Remove ${c.email}`}
                      >
                        {removingId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center justify-between border-t border-[color:var(--border-default)] pt-3">
            <p className="text-xs text-copy-muted">Copy and share this project link.</p>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-copy-secondary"
              onClick={copyLink}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 text-[color:var(--state-success)]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
