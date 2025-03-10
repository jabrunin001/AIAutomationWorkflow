import React from 'react';
import { ConnectionLineComponentProps, getBezierPath } from 'reactflow';

export function ConnectionLine({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}: ConnectionLineComponentProps) {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={2}
        className="animated"
        strokeDasharray="5,5"
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        className="animated"
        strokeDasharray="5,5"
      />
    </g>
  );
} 