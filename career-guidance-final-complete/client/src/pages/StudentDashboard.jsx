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
import { uploadFile } from '../services/storage';
import { useAuth } from '../services/auth';

const SYMBOLS = ['A','B','C','D','E','F'];
const SYMBOL_VALUE = { A:5, B:4, C:3, D:2, E:1, F:0 };

export default function StudentDashboard() {
  const { user, profile, updateProfile } = useAuth();

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const list = await listInstitutions();
      const approved = list.filter(i => i.approved);
      setInstitutions(approved);
      if (approved.length > 0) setSelectedInstitution(approved[0].id);

      if (user) {
        const apps = await listStudentApplications(user.uid);
        setApplications(apps);

        const jobList = await listJobs();
        setJobs(jobList);

        const notes = await listNotifications(user.uid);
        setNotifications(notes);
      }
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    async function fetchCourses() {
      if (selectedInstitution) {
        const cs = await listCoursesForInstitution(selectedInstitution);
        setCourses(cs);
      } else setCourses([]);
    }
    fetchCourses();
  }, [selectedInstitution]);

  const addSubject = () => setSubjects([...subjects, { subject: 'Mathematics', symbol: 'C' }]);
  const updateSubject = (index, key, value) => {
    const copy = [...subjects];
    copy[index] = { ...copy[index], [key]: value };
    setSubjects(copy);
  };

  const doUpload = async (file, type) => {
    if (!file) return alert('Select a PDF file');
    if (!user) return alert('Please sign in');
    try {
      const result = await uploadFile(file, user.uid, type, p => setProgress(p));
      if (type === 'transcript') setTranscriptUrl(result.url);
      else setDocuments([...documents, { name: file.name, url: result.url }]);
      alert(`${type} uploaded successfully`);
    } catch (e) {
      alert('Upload failed: ' + e.message);
    }
  };

  const matches = course => {
    if (!course.requirements || course.requirements.length === 0) return true;
    const map = {};
    subjects.forEach(s => map[s.subject.toLowerCase()] = s.symbol);
    for (const req of course.requirements) {
      const have = map[req.subject.toLowerCase()];
      if (!have) return false;
      if (SYMBOL_VALUE[have] < SYMBOL_VALUE[req.minSymbol]) return false;
    }
    return true;
  };

  const apply = async (instId, courseId) => {
    if (!user) return alert('Please sign in');
    const appsToInst = applications.filter(a => a.institutionId === instId);
    if (appsToInst.length >= 2) return alert('Maximum 2 applications per institution reached');
    await applyToCourse({
      studentId: user.uid,
      institutionId: instId,
      courseId,
      transcriptUrl,
      transcriptData: subjects,
      status: 'submitted',
      createdAt: new Date().toISOString()
    });
    alert('Application submitted');
    const apps = await listStudentApplications(user.uid);
    setApplications(apps);
  };

  const applyJob = async jobId => {
    if (!user) return alert('Please sign in');
    await applyToJob(user.uid, jobId);
    alert('Applied for job');
  };

  return (
    <>
      <Nav />
      <div className="container">

        <div className="card">
          <h2>Student Dashboard</h2>
          <p className="small">Welcome {profile?.displayName}</p>
        </div>

        {/* Profile Update */}
        <div className="card">
          <h3>Update Profile</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={profile?.displayName || ''}
            onChange={e => updateProfile({ displayName: e.target.value })}
            className="p-2 border w-full mb-2"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={profile?.phone || ''}
            onChange={e => updateProfile({ phone: e.target.value })}
            className="p-2 border w-full mb-2"
          />
        </div>

        {/* Upload Transcript */}
        <div className="card">
          <h3>Upload Transcript (PDF)</h3>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
          <div style={{ marginTop: 8 }}>
            <button onClick={() => doUpload(file, 'transcript')} className="btn">Upload</button>
            {progress > 0 && <span style={{ marginLeft: 8 }}>Uploading {progress}%</span>}
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Enter subjects & symbols</h4>
            {subjects.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  value={s.subject}
                  onChange={e => updateSubject(i, 'subject', e.target.value)}
                  className="p-2 border"
                />
                <select
                  value={s.symbol}
                  onChange={e => updateSubject(i, 'symbol', e.target.value)}
                  className="p-2 border"
                >
                  {SYMBOLS.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <button onClick={addSubject} className="btn">Add subject</button>
            </div>
          </div>
        </div>

        {/* Upload Additional Documents */}
        <div className="card">
          <h3>Upload Additional Documents</h3>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
          <button onClick={() => doUpload(file, 'document')} className="btn mt-2">Upload</button>
          <ul>
            {documents.map((d, i) => <li key={i}><a href={d.url} target="_blank" rel="noreferrer">{d.name}</a></li>)}
          </ul>
        </div>

        {/* Courses */}
        <div className="card">
          <h3>Courses filtered by your transcript</h3>
          <label>Institution:</label>
          <select
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
            className="p-2 border w-full mt-2"
          >
            <option value="">--select--</option>
            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>

          <div style={{ marginTop: 12 }}>
            {courses.filter(matches).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{c.description}</div>
                  {c.requirements &&
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      Requires: {c.requirements.map(r => r.subject + ' ≥ ' + r.minSymbol).join(', ')}
                    </div>
                  }
                </div>
                <div>
                  <button onClick={() => apply(selectedInstitution, c.id)} className="btn">Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="card">
          <h3>Your Applications</h3>
          {applications.length === 0 && <div>No applications</div>}
          {applications.map(a => (
            <div key={a.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div><strong>Course:</strong> {a.courseId} — <strong>Status:</strong> {a.status}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Submitted: {a.createdAt}</div>
            </div>
          ))}
        </div>

        {/* Jobs */}
        <div className="card">
          <h3>Available Job Postings</h3>
          {jobs.length === 0 && <div>No job postings</div>}
          {jobs.map(job => (
            <div key={job.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{job.title}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{job.description}</div>
              </div>
              <button onClick={() => applyJob(job.id)} className="btn">Apply</button>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="card">
          <h3>Notifications</h3>
          {notifications.length === 0 && <div>No new notifications</div>}
          <ul>
            {notifications.map((n, i) => <li key={i}>{n.message} - <small>{n.date}</small></li>)}
          </ul>
        </div>

      </div>
      <Footer />
    </>
  );
}
