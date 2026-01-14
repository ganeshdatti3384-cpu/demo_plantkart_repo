
'use client';
import React, { useEffect, useState } from 'react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([] as any[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(setJobs).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {jobs.map(j => (
            <div key={j._id} className="card p-4">
              <h3 className="font-bold">{j.title} <span className="text-sm text-slate-500">@ {j.company}</span></h3>
              <p className="text-sm">{j.location}</p>
              <a href={j.externalUrl} target="_blank" className="text-blue-600 underline">Open Link</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
