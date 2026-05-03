import { redirect } from 'next/navigation'
import { EditorShell } from '@/components/editor/editor-shell'
import { getOwnedProjects, getSharedProjects } from '@/lib/data/projects'
import { getCurrentClerkIdentity } from '@/lib/project-access'

export default async function EditorPage() {
  const identity = await getCurrentClerkIdentity()
  if (!identity.userId) redirect('/sign-in')

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(identity.userId),
    identity.primaryEmail
      ? getSharedProjects(identity.primaryEmail)
      : Promise.resolve([]),
  ])

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
