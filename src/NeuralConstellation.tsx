import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  label?: string;
  size: number;
}

export default function NeuralConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
    const numPoints = 120;
    const sizeRange = 350;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: (Math.random() - 0.5) * sizeRange * 2,
        y: (Math.random() - 0.5) * sizeRange * 2,
        z: (Math.random() - 0.5) * sizeRange * 2,
        size: Math.random() * 2 + 1
      });
    }

    // Add some labelled project/skill node points to make it conceptually unified
    const keywords = ["C++", "Vite", "React", "Docker", "Node.js", "Python", "Algorithms", "WSN"];
    keywords.forEach((word) => {
      points.push({
        x: (Math.random() - 0.5) * sizeRange,
        y: (Math.random() - 0.5) * sizeRange,
        z: (Math.random() - 0.5) * sizeRange,
        label: word,
        size: 3
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Normalize mouse between -1 and 1
      mouseRef.current.targetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseRef.current.targetY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const focalLength = 400;

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

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base auto rotation + mouse rotation influence
      const rotYRate = 0.0015 + mouse.x * 0.005;
      const rotXRate = 0.0008 + mouse.y * 0.005;

      // Rotate all points
      points.forEach((point) => {
        rotateY(point, rotYRate);
        rotateX(point, rotXRate);
      });

      // Sort points by Z index (painter's algorithm) for correct perspective overlay depth
      const sortedPoints = [...points].sort((a, b) => b.z - a.z);

      const projectedPoints = sortedPoints.map((point) => {
        // Perspective divide
        const scale = focalLength / (focalLength + point.z);
        const projX = point.x * scale + width / 2;
        const projY = point.y * scale + height / 2;
        return {
          ...point,
          projX,
          projY,
          scale,
          visible: point.z + focalLength > 0
        };
      });

      // Draw vector lines between nearby projected 3D nodes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (!p1.visible) continue;

        // Draw connections
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          if (!p2.visible) continue;

          // Euclidean 3D distance calculation
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.12 * p1.scale;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw points and labels
      projectedPoints.forEach((point) => {
        if (!point.visible) return;

        const size = point.size * point.scale;
        const alpha = Math.max(0.1, Math.min(1, (point.z + sizeRange) / (sizeRange * 2)));

        if (point.label) {
          // Highlight custom keyword node
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.9})`; // Cyan
          ctx.beginPath();
          ctx.arc(point.projX, point.projY, size + 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.font = `${Math.round(8 * point.scale + 4)}px monospace`;
          ctx.fillText(point.label, point.projX + 6, point.projY + 3);
        } else {
          // Normal constellation node
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.6})`; // Emerald
          ctx.beginPath();
          ctx.arc(point.projX, point.projY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
