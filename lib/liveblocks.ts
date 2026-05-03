import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#E03130",
  "#F76707",
  "#F59F00",
  "#37B24D",
  "#1971C2",
  "#7048E8",
  "#D6336C",
]

export function getCursorColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}

declare global {
  // eslint-disable-next-line no-var
  var liveblocksClient: Liveblocks | undefined
}

// Lazy getter — defers construction to request time so the env var is not
// required during build-time module evaluation.
export function getLiveblocks(): Liveblocks {
  if (process.env.NODE_ENV !== "production") {
    globalThis.liveblocksClient ??= new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })
    return globalThis.liveblocksClient
  }
  return new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! })
}
