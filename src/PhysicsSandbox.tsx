import React, { useEffect, useRef } from 'react';
import synth from './audio';

interface SkillNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  targetRadius: number;
  name: string;
  color: string;
}

interface PhysicsSandboxProps {
  skills: string[];
  hoveredSkill: string | null;
}

export default function PhysicsSandbox({ skills, hoveredSkill }: PhysicsSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999, px: -999, py: -999, isDown: false, activeNodeIndex: -1 });
  const nodesRef = useRef<SkillNode[]>([]);

  // Watch for external list hovers and shoot them up like a fountain!
  useEffect(() => {
    if (hoveredSkill && nodesRef.current.length > 0) {
      const node = nodesRef.current.find(
        (n) => n.name.toLowerCase() === hoveredSkill.toLowerCase()
      );
      if (node) {
        node.vy = -11.5;
        node.vx = (Math.random() - 0.5) * 8;
        synth.playHover();
      }
    }
  }, [hoveredSkill]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight || 280);

    const nodes: SkillNode[] = [];
    const gravity = 0.3;
    const friction = 0.98;
    const bounce = 0.72;

    // Build skill nodes with random positions and initial coordinates
    skills.slice(0, 16).forEach((skill, idx) => {
      const baseRadius = Math.max(30, skill.length * 4.5 + 12);
      nodes.push({
        x: Math.random() * (width - baseRadius * 2) + baseRadius,
        y: Math.random() * (height / 2 - baseRadius) + baseRadius,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        radius: baseRadius,
        baseRadius,
        targetRadius: baseRadius,
        name: skill,
        // Cycle colors
        color: idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#06b6d4' : '#3b82f6'
      });
    });

    nodesRef.current = nodes;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight || 280;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e);
      mouseRef.current.isDown = true;
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.px = pos.x;
      mouseRef.current.py = pos.y;

      // Check if clicked inside a node
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
        if (dist < node.radius) {
          mouseRef.current.activeNodeIndex = i;
          synth.playClick();
          break;
        }
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e);
      const mouse = mouseRef.current;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = pos.x;
      mouse.y = pos.y;
    };

    const handleEnd = () => {
      const mouse = mouseRef.current;
      if (mouse.activeNodeIndex !== -1) {
        const node = nodes[mouse.activeNodeIndex];
        node.vx = (mouse.x - mouse.px) * 0.8;
        node.vy = (mouse.y - mouse.py) * 0.8;
        mouse.activeNodeIndex = -1;
      }
      mouse.isDown = false;
    };

    const handleLeave = () => {
      const mouse = mouseRef.current;
      mouse.x = -999;
      mouse.y = -999;
      mouse.isDown = false;
      mouse.activeNodeIndex = -1;
    };

    // Attach listeners
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    let animationFrameId: number;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Update node physics
      nodes.forEach((node, index) => {
        // Interpolate radius smoothly
        node.radius += (node.targetRadius - node.radius) * 0.1;

        if (index === mouse.activeNodeIndex && mouse.isDown) {
          // Dragging node
          node.x += (mouse.x - node.x) * 0.3;
          node.y += (mouse.y - node.y) * 0.3;
          node.vx = 0;
          node.vy = 0;
        } else {
          // Normal physics integration
          node.vy += gravity;
          node.vx *= friction;
          node.vy *= friction;
          node.x += node.vx;
          node.y += node.vy;

          // Pointer proximity drift & swell (Interactive Rise/Bubble effect)
          const distToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          if (distToMouse < node.radius + 60 && mouse.x > 0) {
            node.targetRadius = node.baseRadius * 1.25;
            // Anti-gravity float lift
            node.vy -= 0.22;
            
            // Push gently away from mouse cursor
            const angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
            node.vx += Math.cos(angle) * 0.25;
          } else {
            node.targetRadius = node.baseRadius;
          }

          // Wall Collisions
          if (node.x - node.radius < 0) {
            node.x = node.radius;
            node.vx = -node.vx * bounce;
          } else if (node.x + node.radius > width) {
            node.x = width - node.radius;
            node.vx = -node.vx * bounce;
          }

          if (node.y - node.radius < 0) {
            node.y = node.radius;
            node.vy = -node.vy * bounce;
          } else if (node.y + node.radius > height) {
            node.y = height - node.radius;
            node.vy = -node.vy * bounce;
            node.vx *= 0.95; // Ground friction slide
          }
        }
      });

      // Rigid Body Circle-to-Circle Collisions & Resolution
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = n1.radius + n2.radius;

          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;

            const overlap = minDist - dist;
            const resolveX = nx * overlap * 0.5;
            const resolveY = ny * overlap * 0.5;

            if (i !== mouse.activeNodeIndex) {
              n1.x -= resolveX;
              n1.y -= resolveY;
            }
            if (j !== mouse.activeNodeIndex) {
              n2.x += resolveX;
              n2.y += resolveY;
            }

            const rvx = n2.vx - n1.vx;
            const rvy = n2.vy - n1.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal < 0) {
              const impulse = -(1 + bounce) * velAlongNormal;
              const impulseX = impulse * nx * 0.5;
              const impulseY = impulse * ny * 0.5;

              if (i !== mouse.activeNodeIndex) {
                n1.vx -= impulseX;
                n1.vy -= impulseY;
              }
              if (j !== mouse.activeNodeIndex) {
                n2.vx += impulseX;
                n2.vy += impulseY;
              }

              if (Math.abs(velAlongNormal) > 1.2) {
                synth.playHover();
              }
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.round(node.radius * 0.22 + 4)}px Courier New, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [skills]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30 select-none pointer-events-none">
        INV_PHYSICS_SANDBOX // HOVER TO DRIFT // LIST HOVERS SHOOT THEM UP
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
