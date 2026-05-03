import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentClerkIdentity } from '@/lib/project-access'

export interface CollaboratorResponse {
  id: string
  email: string
  displayName: string | null
  imageUrl: string | null
}

async function enrichCollaborators(
  collaborators: { id: string; email: string }[]
): Promise<CollaboratorResponse[]> {
  if (collaborators.length === 0) return []

  const emails = collaborators.map((c) => c.email)
  const client = await clerkClient()
  const { data: clerkUsers } = await client.users.getUserList({ emailAddress: emails })

  const clerkByEmail = new Map<string, { displayName: string | null; imageUrl: string }>(
    clerkUsers.map((u) => {
      const email =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        ''
      const displayName =
        [u.firstName, u.lastName].filter(Boolean).join(' ') || null
      return [email, { displayName, imageUrl: u.imageUrl }]
    })
  )

  return collaborators.map((c) => {
    const clerk = clerkByEmail.get(c.email)
    return {
      id: c.id,
      email: c.email,
      displayName: clerk?.displayName ?? null,
      imageUrl: clerk?.imageUrl ?? null,
    }
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentClerkIdentity()
  if (!identity.userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: {
        select: { id: true, email: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const isOwner = project.ownerId === identity.userId
  if (!isOwner) {
    if (
      !identity.primaryEmail ||
      !project.collaborators.some((c) => c.email === identity.primaryEmail)
    ) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const enriched = await enrichCollaborators(project.collaborators)
  return Response.json(enriched)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentClerkIdentity()
  if (!identity.userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })
  if (existing) {
    return Response.json({ error: 'Already a collaborator' }, { status: 409 })
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: { projectId, email },
  })

  const [enriched] = await enrichCollaborators([{ id: collaborator.id, email: collaborator.email }])
  return Response.json(enriched, { status: 201 })
}
