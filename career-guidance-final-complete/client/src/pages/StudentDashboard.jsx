import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
  listInstitutions,
  listCoursesForInstitution,
  applyToCourse,
  listStudentApplications,
  listJobs,
  applyToJob,
  listNotifications
} from '../services/firestore';
import { uploadTranscriptFile } from '../services/storage';
import { useAuth } from '../services/auth';

const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SYMBOL_VALUE = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export default function StudentDashboard() {
  const { user, profile } = useAuth();

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // --- Load Institutions and Applications ---
  useEffect(() => {
    (async () => {
      const list = await listInstitutions();
      const approved = list.filter(i => i.approved);
      setInstitutions(approved);
      if (approved.length > 0) setSelectedInstitution(approved[0].id);

      if (user) {
        const apps = await listStudentApplications(user.uid);
        setApplications(apps);

        const notifs = await listNotifications(user.uid);
        setNotifications(notifs);

        const jobList = await listJobs();
        setJobs(jobList);
      }
    })();
  }, [user]);

  // --- Load Courses when Institution changes ---
  useEffect(() => {
    (async () => {
      if (selectedInstitution) {
        const cs = await listCoursesForInstitution(selectedInstitution);
        setCourses(cs);
      } else {
        setCourses([]);
      }
    })();
  }, [selectedInstitution]);

  // --- Transcript management ---
  function addSubject() {
    setSubjects(s => [...s, { subject: 'Mathematics', symbol: 'C' }]);
  }

  function updateSubject(i, key, val) {
    setSubjects(s => {
      const copy = [...s];
      copy[i] = { ...copy[i], [key]: val };
      return copy;
    });
  }

  async function doUpload() {
    if (!file) return alert('Select a PDF');
    if (!user) return alert('Sign in first');
    try {
      const r = await uploadTranscriptFile(file, user.uid, p => setProgress(p));
      setTranscriptUrl(r.url);
      alert('Transcript uploaded successfully');
    } catch (e) {
      alert('Upload failed: ' + e.message);
    }
  }

  // --- Matching logic ---
  function matches(course) {
    if (!course.requirements || course.requirements.length === 0) return true;
    const map = {};
    subjects.forEach(s => (map[s.subject.toLowerCase()] = s.symbol));
    for (const req of course.requirements) {
      const have = map[req.subject.toLowerCase()];
      if (!have) return false;
      if (SYMBOL_VALUE[have] < SYMBOL_VALUE[req.minSymbol]) return false;
    }
    return true;
  }

  // --- Apply to course ---
  async function apply(instId, courseId) {
    if (!user) return alert('Sign in first');
    const appsToInst = applications.filter(a => a.institutionId === instId);
    if (appsToInst.length >= 2) return alert('Max 2 applications per institution reached');
    await applyToCourse({
      studentId: user.uid,
      institutionId: instId,
      courseId,
      transcriptUrl,
      transcriptData: subjects,
      status: 'submitted',
      createdAt: new Date().toISOString()
    });
    alert('Course application submitted');
    const apps = await listStudentApplications(user.uid);
    setApplications(apps);
  }

  // --- Apply to job ---
  async function applyJob(jobId) {
    if (!user) return alert('Sign in first');
    await applyToJob({
      studentId: user.uid,
      jobId,
      appliedAt: new Date().toISOString()
    });
    alert('Job application submitted');
  }

  return (
    <>
      <Nav />
      <div className="container my-10 space-y-10">

        {/* Welcome Card */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold">Student Dashboard</h2>
          <p className="small text-gray-700">Welcome {profile?.displayName}</p>
        </div>

        {/* Transcript Upload */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Upload Transcript (PDF)</h3>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
          <div>
            <button onClick={doUpload} className="btn">Upload</button>
            {progress > 0 && <span className="ml-2">Uploading {progress}%</span>}
          </div>

          <div>
            <h4 className="font-medium">Enter Subjects & Symbols</h4>
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input value={s.subject} onChange={e => updateSubject(i, 'subject', e.target.value)} className="p-2 border rounded" />
                <select value={s.symbol} onChange={e => updateSubject(i, 'symbol', e.target.value)} className="p-2 border rounded">
                  {SYMBOLS.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            ))}
            <button onClick={addSubject} className="btn mt-2">Add Subject</button>
          </div>
        </div>

        {/* Courses Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Courses Filtered By Your Transcript</h3>
          <label>Institution:</label>
          <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="w-full p-2 border rounded mt-2">
            <option value="">-- Select --</option>
            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <div className="mt-4 space-y-2">
            {courses.filter(matches).map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-gray-600 text-sm">{c.description}</div>
                  {c.requirements && <div className="text-gray-500 text-sm">
                    Requires: {c.requirements.map(r => r.subject + ' ≥ ' + r.minSymbol).join(', ')}
                  </div>}
                </div>
                <button onClick={() => apply(selectedInstitution, c.id)} className="btn">Apply</button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Available Jobs</h3>
          {jobs.length === 0 && <div>No jobs available</div>}
          {jobs.map(job => (
            <div key={job.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-gray-600 text-sm">{job.description}</div>
              </div>
              <button onClick={() => applyJob(job.id)} className="btn">Apply</button>
            </div>
          ))}
        </div>

        {/* Applications Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Your Course Applications</h3>
          {applications.length === 0 && <div>No applications submitted yet</div>}
          {applications.map(a => (
            <div key={a.id} className="p-3 border rounded">
              <div><strong>Course:</strong> {a.courseId} — <strong>Status:</strong> {a.status}</div>
              <div className="text-gray-500 text-sm">Submitted: {a.createdAt}</div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Notifications</h3>
          {notifications.length === 0 && <div>No notifications</div>}
          {notifications.map(n => (
            <div key={n.id} className="p-3 border rounded">
              <div>{n.message}</div>
              <div className="text-gray-500 text-sm">{n.createdAt}</div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
