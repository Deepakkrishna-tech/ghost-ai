import Link from "next/link"
import { LockKeyhole } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-copy-primary">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-accent-dim">
          <LockKeyhole className="h-5 w-5 text-brand" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-copy-primary">
            Workspace unavailable
          </h1>
          <p className="text-sm leading-6 text-copy-muted">
            This project does not exist, or you do not have access to it.
          </p>
        </div>
        <Link href="/editor" className={buttonVariants({ size: "sm" })}>
          Back to projects
        </Link>
      </div>
    </main>
  )
}
