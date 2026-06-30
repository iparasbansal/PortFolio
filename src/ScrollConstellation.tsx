import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

export default function ScrollConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize 3D points
    const points: Point3D[] = [];
    const numPoints = 160;
    const sizeRange = 500;
    const depthRange = 1000;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: (Math.random() - 0.5) * sizeRange * 3,
        y: (Math.random() - 0.5) * sizeRange * 3,
        z: Math.random() * depthRange, // Z goes from 0 to depthRange
        size: Math.random() * 1.5 + 0.8,
        color: i % 4 === 0 ? 'rgba(34, 211, 238, ' : 'rgba(16, 185, 129, ' // Cyan / Emerald
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseRef.current.targetY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const focalLength = 350;

    const rotateY = (point: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos - point.z * sin;
      const z = point.x * sin + point.z * cos;
      point.x = x;
      point.z = z;
    };

    const rotateX = (point: Point3D, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      point.y = y;
      point.z = z;
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse and scroll interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const scroll = scrollRef.current;
      scroll.current += (scroll.target - scroll.current) * 0.08;

      // Base auto rotation + mouse rotation influence
      const rotYRate = 0.001 + mouse.x * 0.004;
      const rotXRate = 0.0006 + mouse.y * 0.004;

      // Map scroll offset to depth translation
      // Every pixel scrolled moves particles closer on the Z axis
      const scrollSpeedFactor = 0.45;
      const scrollZOffset = scroll.current * scrollSpeedFactor;

      const projectedPoints = points.map((point) => {
        // Rotate in local coordinates
        rotateY(point, rotYRate);
        rotateX(point, rotXRate);

        // Apply scroll depth displacement along Z-axis
        let zOffset = (point.z - scrollZOffset) % depthRange;
        if (zOffset < -focalLength) {
          zOffset += depthRange;
        } else if (zOffset > depthRange - focalLength) {
          zOffset -= depthRange;
        }

        // Perspective divide
        const scale = focalLength / (focalLength + zOffset);
        const projX = point.x * scale + width / 2;
        const projY = point.y * scale + height / 2;

        return {
          ...point,
          projX,
          projY,
          scale,
          zOffset,
          visible: zOffset + focalLength > 0
        };
      });

      // Draw vector lines between nearby projected 3D nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (!p1.visible) continue;

        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          if (!p2.visible) continue;

          // Compute distance in modified coordinate space
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.zOffset - p2.zOffset;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.1 * p1.scale;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projectedPoints.forEach((point) => {
        if (!point.visible) return;

        const size = point.size * point.scale;
        
        // Opacity drops as particles get extremely close or far
        let alpha = Math.max(0.1, Math.min(1, (point.zOffset + focalLength) / (depthRange * 0.7)));
        if (point.zOffset < 50) {
          // Fade out quickly when flying very close/past camera to avoid large sudden dots
          alpha *= Math.max(0, point.zOffset + focalLength) / (50 + focalLength);
        }

        ctx.fillStyle = `${point.color}${alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(point.projX, point.projY, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
