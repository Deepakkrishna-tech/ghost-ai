import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface ClerkIdentity {
  userId: string | null
  primaryEmail: string | null
}

export interface AccessibleProject {
  id: string
  name: string
  ownerId: string
}

export interface ProjectAccessResult {
  hasAccess: boolean
  project: AccessibleProject | null
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity> {
  const { userId } = await auth()

  if (!userId) {
    return { userId: null, primaryEmail: null }
  }

  const user = await currentUser()
  const primaryEmail =
    user?.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  return { userId, primaryEmail }
}

export async function checkProjectAccess(
  projectId: string,
  identity: ClerkIdentity
): Promise<ProjectAccessResult> {
  if (!identity.userId) {
    return { hasAccess: false, project: null }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) {
    return { hasAccess: false, project: null }
  }

  if (project.ownerId === identity.userId) {
    return { hasAccess: true, project }
  }

  if (!identity.primaryEmail) {
    return { hasAccess: false, project: null }
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email: identity.primaryEmail,
      },
    },
    select: { id: true },
  })

  return collaborator
    ? { hasAccess: true, project }
    : { hasAccess: false, project: null }
}
