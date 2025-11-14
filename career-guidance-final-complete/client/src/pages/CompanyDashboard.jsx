import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { 
  postJob, 
  listCompanyJobs, 
  listQualifiedApplicants 
} from '../services/firestore';
import { useAuth } from '../services/auth';

export default function CompanyDashboard() {
  const { user, profile } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    qualifications: '',
    requirements: ''
  });
  const [selectedJobId, setSelectedJobId] = useState('');

  // Load company jobs
  useEffect(() => {
    async function fetchJobs() {
      if (!profile?.companyId) return;
      const j = await listCompanyJobs(profile.companyId);
      setJobs(j);
    }
    fetchJobs();
  }, [profile]);

  // Create a new job
  const handlePostJob = async () => {
    if (!newJob.title || !newJob.description) return alert('Title and description required');
    await postJob(profile.companyId, newJob);
    alert('Job posted successfully');
    setNewJob({ title: '', description: '', qualifications: '', requirements: '' });
    const j = await listCompanyJobs(profile.companyId);
    setJobs(j);
  };

  // Load qualified applicants for a job
  const handleLoadApplicants = async jobId => {
    setSelectedJobId(jobId);
    const filteredApplicants = await listQualifiedApplicants(jobId);
    setApplicants(filteredApplicants);
  };

  return (
    <>
      <Nav />
      <div className="container">

        <div className="card">
          <h2>Company Dashboard</h2>
          <p className="small">Welcome, {profile?.displayName}</p>
        </div>

        {/* Post Job */}
        <div className="card">
          <h3>Post a Job Opportunity</h3>
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={e => setNewJob({ ...newJob, title: e.target.value })}
            className="p-2 border w-full mb-2"
          />
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
            className="p-2 border w-full mb-2"
          />
          <input
            type="text"
            placeholder="Required Qualifications"
            value={newJob.qualifications}
            onChange={e => setNewJob({ ...newJob, qualifications: e.target.value })}
            className="p-2 border w-full mb-2"
          />
          <input
            type="text"
            placeholder="Other Requirements (certificates, experience, etc.)"
            value={newJob.requirements}
            onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
            className="p-2 border w-full mb-2"
          />
          <button onClick={handlePostJob} className="btn">Post Job</button>
        </div>

        {/* Company Jobs */}
        <div className="card">
          <h3>Your Job Postings</h3>
          {jobs.length === 0 && <div>No jobs posted yet.</div>}
          {jobs.map(job => (
            <div key={job.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{job.description}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Qualifications: {job.qualifications}<br />
                Requirements: {job.requirements}
              </div>
              <button onClick={() => handleLoadApplicants(job.id)} className="btn mt-2">View Qualified Applicants</button>
            </div>
          ))}
        </div>

        {/* Qualified Applicants */}
        {selectedJobId && (
          <div className="card">
            <h3>Qualified Applicants</h3>
            {applicants.length === 0 && <div>No qualified applicants yet.</div>}
            {applicants.map(a => (
              <div key={a.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
                <div><strong>Student:</strong> {a.studentName} ({a.studentId})</div>
                <div>Academic Performance: {a.academicScore}</div>
                <div>Certificates: {a.certificates?.join(', ') || 'None'}</div>
                <div>Work Experience: {a.experience?.join(', ') || 'None'}</div>
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
