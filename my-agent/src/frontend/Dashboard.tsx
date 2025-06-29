import React, { useEffect, useState } from 'react';

export default function Dashboard() {
   const [metrics, setMetrics] = useState<any[]>([]);
   useEffect(() => {
      fetch('http://localhost:4000/metrics')
         .then(res => res.json())
         .then(setMetrics);
   }, []);
   const agentCounts = metrics.reduce((acc, m) => {
      acc[m.agent] = (acc[m.agent] || 0) + 1;
      return acc;
   }, {} as Record<string, number>);
   return (
      <div style={{ padding: 24 }}>
         <h2>Support Metrics</h2>
         <ul>
            {Object.entries(agentCounts).map(([agent, count]) => (
               <li key={agent}>{agent}: {count} queries</li>
            ))}
         </ul>
         <h3>Recent Queries</h3>
         <ul>
            {metrics.slice(-10).reverse().map((m, i) => (
               <li key={i}>{new Date(m.ts).toLocaleString()}: <b>{m.user}</b> asked <i>{m.query}</i> → <b>{m.agent}</b> replied: <code>{m.response}</code></li>
            ))}
         </ul>
      </div>
   );
} 