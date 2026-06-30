import React, { useEffect, useRef } from 'react';

interface AcoNode {
  id: string;
  x: number;
  y: number;
  label: string;
  isStart?: boolean;
  isEnd?: boolean;
}

interface AcoLink {
  from: string;
  to: string;
  distance: number;
  pheromone: number;
}

interface Ant {
  x: number;
  y: number;
  path: string[];
  currentNode: string;
  targetNode: string;
  progress: number;
  speed: number;
  complete: boolean;
}

export default function AcoSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 540);
    const height = (canvas.height = 240);

    const nodes: AcoNode[] = [
      { id: 'S', x: 50, y: height / 2, label: 'Source', isStart: true },
      { id: 'A', x: 150, y: 50, label: 'Node A' },
      { id: 'B', x: 150, y: 190, label: 'Node B' },
      { id: 'C', x: 270, y: 70, label: 'Node C' },
      { id: 'D', x: 270, y: 170, label: 'Node D' },
      { id: 'E', x: 390, y: 120, label: 'Node E' },
      { id: 'Gateway', x: 490, y: height / 2, label: 'Sink', isEnd: true }
    ];

    const nodeMap = new Map<string, AcoNode>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const links: AcoLink[] = [
      { from: 'S', to: 'A', distance: 100, pheromone: 1.0 },
      { from: 'S', to: 'B', distance: 160, pheromone: 1.0 },
      { from: 'A', to: 'C', distance: 120, pheromone: 1.0 },
      { from: 'A', to: 'D', distance: 150, pheromone: 1.0 },
      { from: 'B', to: 'D', distance: 130, pheromone: 1.0 },
      { from: 'B', to: 'C', distance: 180, pheromone: 1.0 },
      { from: 'C', to: 'E', distance: 130, pheromone: 1.0 },
      { from: 'D', to: 'E', distance: 110, pheromone: 1.0 },
      { from: 'C', to: 'Gateway', distance: 220, pheromone: 1.0 },
      { from: 'E', to: 'Gateway', distance: 100, pheromone: 1.0 }
    ];

    const ants: Ant[] = [];
    const maxAnts = 12;
    const evaporationRate = 0.985;
    const pheromoneStrength = 1.5;

    const findConnectedLinks = (nodeId: string): AcoLink[] => {
      return links.filter(l => l.from === nodeId || l.to === nodeId);
    };

    const spawnAnt = (): Ant => {
      return {
        x: 50,
        y: height / 2,
        path: ['S'],
        currentNode: 'S',
        targetNode: '',
        progress: 0,
        speed: Math.random() * 0.02 + 0.015,
        complete: false
      };
    };

    for (let i = 0; i < maxAnts; i++) {
      ants.push(spawnAnt());
    }

    const selectNextNode = (ant: Ant): string => {
      const connected = findConnectedLinks(ant.currentNode);
      const candidates = connected.map(link => {
        const next = link.from === ant.currentNode ? link.to : link.from;
        return { next, link };
      }).filter(c => !ant.path.includes(c.next));

      if (candidates.length === 0) {
        return 'Gateway';
      }

      let totalWeight = 0;
      const weights = candidates.map(c => {
        const heuristic = 200 / c.link.distance;
        const weight = Math.pow(c.link.pheromone, 1.2) * Math.pow(heuristic, 2);
        totalWeight += weight;
        return weight;
      });

      let rand = Math.random() * totalWeight;
      for (let i = 0; i < candidates.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return candidates[i].next;
      }
      return candidates[0].next;
    };

    let animationFrameId: number;
    let frameCount = 0;
    let iterations = 0;
    let currentBestPath: string[] = [];

    const loop = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      frameCount++;

      // Evaporate pheromones
      if (frameCount % 60 === 0) {
        links.forEach(l => {
          l.pheromone = Math.max(0.2, l.pheromone * evaporationRate);
        });
        iterations++;
      }

      // Draw Links
      links.forEach((link) => {
        const n1 = nodeMap.get(link.from)!;
        const n2 = nodeMap.get(link.to)!;
        const intensity = Math.min(1, link.pheromone / 4);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + intensity * 0.75})`;
        ctx.lineWidth = 1 + link.pheromone * 0.9;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      });

      // Update and Draw Ants
      ants.forEach((ant, index) => {
        if (ant.complete) {
          const pathQuality = 600 / ant.path.length;
          for (let i = 0; i < ant.path.length - 1; i++) {
            const fromId = ant.path[i];
            const toId = ant.path[i + 1];
            const link = links.find(
              l => (l.from === fromId && l.to === toId) || (l.from === toId && l.to === fromId)
            );
            if (link) {
              link.pheromone += pheromoneStrength * pathQuality * 0.05;
            }
          }
          ants[index] = spawnAnt();
          return;
        }

        if (!ant.targetNode) {
          ant.targetNode = selectNextNode(ant);
        }

        const curr = nodeMap.get(ant.currentNode)!;
        const dest = nodeMap.get(ant.targetNode)!;

        ant.progress += ant.speed;
        if (ant.progress >= 1) {
          ant.currentNode = ant.targetNode;
          ant.path.push(ant.targetNode);
          ant.targetNode = '';
          ant.progress = 0;

          if (ant.currentNode === 'Gateway') {
            ant.complete = true;
          }
        } else {
          ant.x = curr.x + (dest.x - curr.x) * ant.progress;
          ant.y = curr.y + (dest.y - curr.y) * ant.progress;
        }

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(ant.x, ant.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodes.forEach((node) => {
        ctx.shadowColor = node.isStart ? '#10b981' : node.isEnd ? '#06b6d4' : '#3b82f6';
        ctx.shadowBlur = 6;
        ctx.fillStyle = node.isStart ? '#10b981' : node.isEnd ? '#06b6d4' : '#0f172a';
        ctx.strokeStyle = node.isStart ? '#10b981' : node.isEnd ? '#06b6d4' : '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 11);
      });

      // Compute best path (highest pheromone links) without React state triggers
      const bestPath: string[] = ['S'];
      let current = 'S';
      while (current !== 'Gateway' && bestPath.length < 8) {
        const connected = findConnectedLinks(current);
        let bestLink: AcoLink | null = null;
        let nextNode = '';
        connected.forEach(link => {
          const next = link.from === current ? link.to : link.from;
          if (!bestPath.includes(next)) {
            if (!bestLink || link.pheromone > bestLink.pheromone) {
              bestLink = link;
              nextNode = next;
            }
          }
        });
        if (nextNode) {
          bestPath.push(nextNode);
          current = nextNode;
        } else {
          break;
        }
      }
      if (bestPath[bestPath.length - 1] === 'Gateway') {
        currentBestPath = bestPath;
      }

      // Draw UI texts directly on Canvas context for maximum performance (0 re-renders)
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`ACO OPTIMIZER // ITER: ${iterations}`, 10, 15);

      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`BEST PATH: ${currentBestPath.join(' ➔ ')}`, 10, height - 10);

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full bg-[#020617] border border-white/5 rounded-2xl overflow-hidden p-3 space-y-3">
      <div className="flex justify-center bg-[#020617] rounded-xl overflow-hidden py-1">
        <canvas ref={canvasRef} className="max-w-full block" />
      </div>
      <p className="text-[9px] text-white/40 leading-relaxed font-light font-mono text-center">
        Ant particles dynamically adjust routing tables based on energy penalty heuristics and pheromone overlays.
      </p>
    </div>
  );
}
