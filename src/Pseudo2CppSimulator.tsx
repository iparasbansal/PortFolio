import React, { useEffect, useState } from 'react';

interface LogLine {
  text: string;
  type: 'info' | 'success' | 'code' | 'input';
}

const STEPS = [
  { text: '> INPUT: find shortest path in weighted graph using Dijkstra', type: 'input' },
  { text: '[NLP] Lexical tokenizer matching tokens: ["shortest", "weighted", "Dijkstra"]', type: 'info' },
  { text: '[NLP] Semantic mapping rules selected: Dijkstra Template O(E log V)', type: 'info' },
  { text: '[LINKER] Retrieval template index: 12', type: 'info' },
  { text: '[TRANSPILE] Injecting boilerplate...', type: 'info' },
  { 
    text: `// Transpiled C++ Output:
#include <vector>
#include <queue>
using namespace std;

vector<int> dijkstra(int n, vector<vector<pair<int, int>>>& adj, int src) {
    vector<int> dist(n, 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while(!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if(d > dist[u]) continue;
        for(auto [v, w] : adj[u]) {
            if(dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`, 
    type: 'code' 
  },
  { text: '✔ Transpilation Complete. Executable compiled successfully.', type: 'success' },
] as const;

export default function Pseudo2CppSimulator() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => {
        // Reset the compilation loop after all steps are displayed plus some delay frames
        if (prev >= STEPS.length + 4) {
          return 0;
        }
        return prev + 1;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  const visibleSteps = STEPS.slice(0, Math.min(stepIndex + 1, STEPS.length));

  return (
    <div className="w-full bg-slate-950 border border-white/10 rounded-2xl overflow-hidden p-4 font-mono text-[10px] sm:text-xs text-emerald-400 space-y-3 shadow-inner">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[9px] text-slate-500">
        <span>PSEUDO2CPP TRANSPILED CONSOLE // REAL-TIME EVAL</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {visibleSteps.map((log, idx) => (
          <div key={idx} className="leading-relaxed">
            {log.type === 'input' && <span className="text-cyan-400 font-semibold">{log.text}</span>}
            {log.type === 'info' && <span className="text-white/60">{log.text}</span>}
            {log.type === 'success' && <span className="text-emerald-400 font-bold">{log.text}</span>}
            {log.type === 'code' && (
              <pre className="mt-1 p-2 bg-black/40 rounded border border-white/5 text-amber-300 overflow-x-auto text-[9px] leading-normal">
                <code>{log.text}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
