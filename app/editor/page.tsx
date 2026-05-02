import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { EditorShell } from '@/components/editor/editor-shell'
import { getOwnedProjects, getSharedProjects } from '@/lib/data/projects'

export default async function EditorPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const primaryEmail = user?.emailAddresses?.[0]?.emailAddress ?? ''

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    primaryEmail ? getSharedProjects(primaryEmail) : Promise.resolve([]),
  ])

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
