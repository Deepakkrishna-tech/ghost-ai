import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAuthAppearance } from "@/components/auth/clerk-auth-appearance"

export default async function SignInPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/editor")
  }

  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Design systems at the speed of thought."
      description="Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time."
      features={[
        {
          icon: "sparkles",
          title: "AI Architecture Generation",
          description:
            "Describe your system, and AI maps it to nodes and edges on a live canvas.",
        },
        {
          icon: "users",
          title: "Real-time Collaboration",
          description:
            "Live cursors, presence indicators, and shared node editing across your team.",
        },
        {
          icon: "file-text",
          title: "Instant Spec Generation",
          description:
            "Export a complete Markdown technical spec directly from the canvas graph.",
        },
      ]}
    >
      <div className="w-full overflow-hidden rounded-3xl border border-surface-border bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="border-b border-surface-border px-4 py-6 text-center sm:px-6">
          <h2 className="text-[22px] font-semibold text-copy-primary">
            Sign in to Ghost AI
          </h2>
          <p className="mt-2 text-[15px] text-copy-muted">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 px-4 pb-4 pt-5 sm:px-6">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl={signUpUrl}
            forceRedirectUrl="/editor"
            appearance={clerkAuthAppearance}
          />
        </div>
      </div>
    </AuthShell>
  )
}
