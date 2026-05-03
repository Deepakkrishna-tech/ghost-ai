"use client";

import React, { type ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

interface CanvasWrapperProps {
  roomId: string;
}

function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(255,255,255,0.06)"
          size={1}
          gap={20}
        />
        <MiniMap
          nodeStrokeColor="var(--border-subtle)"
          nodeColor="var(--bg-elevated)"
          maskColor="rgba(11,15,20,0.75)"
        />
      </ReactFlow>
    </div>
  );
}

class CanvasErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <div className="h-full w-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <CanvasErrorBoundary
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-copy-muted">
                  Could not connect to canvas.
                </p>
              </div>
            }
          >
            <ClientSideSuspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-copy-muted">Loading canvas…</p>
                </div>
              }
            >
              <CanvasFlow />
            </ClientSideSuspense>
          </CanvasErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
}
