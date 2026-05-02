import type { ReactNode } from "react"
import { FileText, Sparkles, Users } from "lucide-react"

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  features: Array<{
    title: string
    description: string
    icon: "sparkles" | "users" | "file-text"
  }>
  children: ReactNode
}

const featureIcons = {
  sparkles: Sparkles,
  users: Users,
  "file-text": FileText,
}

export function AuthShell({
  eyebrow,
  title,
  description,
  features,
  children,
}: AuthShellProps) {
  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden bg-base text-copy-primary md:grid-cols-2">
      <section className="hidden h-full min-h-0 items-center justify-center overflow-hidden border-surface-border px-4 sm:px-6 md:flex md:border-r md:px-12">
        <div className="w-full max-w-lg space-y-8 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-[8px] bg-brand shadow-[0_0_0_1px_rgba(255,255,255,0.02)]" />
            <p className="text-sm font-medium text-copy-primary">Ghost AI</p>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-copy-muted">
              {eyebrow}
            </p>
            <h1 className="max-w-[12ch] text-5xl font-semibold leading-[1.05] text-copy-primary">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-7 text-copy-secondary">
              {description}
            </p>
          </div>

          <ul className="space-y-5">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon]

              return (
                <li key={feature.title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-elevated text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-copy-primary">
                      {feature.title}
                    </p>
                    <p className="text-sm leading-6 text-copy-muted">
                      {feature.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="flex h-full min-h-0 items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  )
}
