import { SignUp } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAuthAppearance } from "@/components/auth/clerk-auth-appearance"

export default async function SignUpPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/editor")
  }

  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"

  return (
    <AuthShell
      eyebrow="Get started"
      title="Start building in minutes."
      description="Create your Ghost AI account, then shape system designs, collaborate live, and turn the canvas into a spec."
      features={[
        {
          icon: "sparkles",
          title: "Prompt-to-Canvas",
          description:
            "Generate an initial architecture from a natural language prompt.",
        },
        {
          icon: "users",
          title: "Shared Workspaces",
          description:
            "Invite collaborators and refine architecture together in one room.",
        },
        {
          icon: "file-text",
          title: "Persistent Specs",
          description:
            "Turn the final graph into a Markdown technical spec you can review or download.",
        },
      ]}
    >
      <div className="w-full overflow-hidden rounded-3xl border border-surface-border bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="border-b border-surface-border px-4 py-6 text-center sm:px-6">
          <h2 className="text-[22px] font-semibold text-copy-primary">
            Create your Ghost AI account
          </h2>
          <p className="mt-2 text-[15px] text-copy-muted">
            Start with a free workspace and invite your team anytime
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 px-4 pb-4 pt-5 sm:px-6">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl={signInUrl}
            forceRedirectUrl="/editor"
            appearance={clerkAuthAppearance}
          />
        </div>
      </div>
    </AuthShell>
  )
}
