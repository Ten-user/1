import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { listJobs, listStudentApplications } from '../services/firestore';
import { useAuth } from '../services/auth';

export default function CompanyDashboard() {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    (async () => {
      const jobList = await listJobs();
      setJobs(jobList);

      const apps = await listStudentApplications(user.uid); // if needed for filtering
      setApplications(apps);
    })();
  }, [user]);

  return (
    <>
      <Nav />
      <div className="container my-10 space-y-10">

        <div className="card p-6">
          <h2 className="text-2xl font-bold">Company Dashboard</h2>
          <p className="text-gray-700">Welcome {profile?.displayName}</p>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Job Opportunities</h3>
          {jobs.length === 0 && <div>No jobs posted yet</div>}
          {jobs.map(job => (
            <div key={job.id} className="p-3 border rounded flex justify-between items-center mt-2">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-gray-600 text-sm">{job.description}</div>
              </div>
              <button className="btn">View Applicants</button>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
