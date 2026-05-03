import { prisma } from '@/lib/prisma'

export type ProjectData = {
  id: string
  name: string
  ownerId: string
}

export async function getOwnedProjects(userId: string): Promise<ProjectData[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, ownerId: true },
  })
}

export async function getSharedProjects(userEmail: string): Promise<ProjectData[]> {
  const collabs = await prisma.projectCollaborator.findMany({
    where: { email: userEmail },
    include: {
      project: { select: { id: true, name: true, ownerId: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return collabs.map((c) => c.project)
}
