import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { EditorShell } from "@/components/editor/editor-shell"
import { getOwnedProjects, getSharedProjects } from "@/lib/data/projects"
import {
  checkProjectAccess,
  getCurrentClerkIdentity,
} from "@/lib/project-access"

export default async function EditorWorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const identity = await getCurrentClerkIdentity()

  if (!identity.userId) {
    redirect("/sign-in")
  }

  const access = await checkProjectAccess(roomId, identity)

  if (!access.hasAccess || !access.project) {
    return <AccessDenied />
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(identity.userId),
    identity.primaryEmail
      ? getSharedProjects(identity.primaryEmail)
      : Promise.resolve([]),
  ])

  const isOwner = identity.userId === access.project.ownerId

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProject={access.project}
      isOwner={isOwner}
    />
  )
}
