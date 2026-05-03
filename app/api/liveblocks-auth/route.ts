import { currentUser } from "@clerk/nextjs/server"
import { getLiveblocks, getCursorColor } from "@/lib/liveblocks"
import {
  getCurrentClerkIdentity,
  checkProjectAccess,
} from "@/lib/project-access"

export async function POST(request: Request) {
  const identity = await getCurrentClerkIdentity()

  if (!identity.userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const room: string | undefined = body?.room

  if (!room) {
    return new Response("room is required", { status: 400 })
  }

  const access = await checkProjectAccess(room, identity)

  if (!access.hasAccess) {
    return new Response("Forbidden", { status: 403 })
  }

  const user = await currentUser()
  const name =
    user?.fullName ??
    user?.username ??
    identity.primaryEmail ??
    "Anonymous"
  const avatar = user?.imageUrl ?? ""
  const color = getCursorColor(identity.userId)

  const liveblocks = getLiveblocks()

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] })

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  })

  session.allow(room, session.FULL_ACCESS)

  const { status, body: sessionBody } = await session.authorize()
  return new Response(sessionBody, { status })
}
