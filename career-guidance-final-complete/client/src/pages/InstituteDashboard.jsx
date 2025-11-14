import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { listInstitutions, listCoursesForInstitution, listApplicationsForCourse } from '../services/firestore';
import { useAuth } from '../services/auth';

export default function InstituteDashboard() {
  const { profile, user } = useAuth();
  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    (async () => {
      if (profile?.institutionId) {
        const inst = (await listInstitutions()).find(x => x.id === profile.institutionId);
        setInstitution(inst);
        const cs = await listCoursesForInstitution(profile.institutionId);
        setCourses(cs);
      }
    })();
  }, [profile]);

  async function loadApplications(courseId) {
    const apps = await listApplicationsForCourse(courseId);
    setApplications(apps);
  }

  async function accept(appId) {
    // Call Firebase Function or API to accept student
    const url = '/__/functions/acceptAdmission'; // replace with real function endpoint
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, instituteAdminUid: user.uid })
    });
    const data = await res.json();
    if (data.ok) alert('Accepted — other applications cancelled and student notified');
    else alert('Failed: ' + (data.message || ''));
    const cs = await listCoursesForInstitution(profile.institutionId);
    setCourses(cs);
  }

  return (
    <>
      <Nav />
      <div className="container my-10 space-y-10">

        <div className="card p-6">
          <h2 className="text-2xl font-bold">Institute Panel</h2>
          <p className="text-gray-700">Viewing data for: {institution?.name}</p>
        </div>

        {/* Courses Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Courses</h3>
          {courses.length === 0 && <div>No courses yet.</div>}
          {courses.map(c => (
            <div key={c.id} className="p-3 border rounded flex justify-between items-center mt-2">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-gray-600 text-sm">{c.description}</div>
              </div>
              <button onClick={() => loadApplications(c.id)} className="btn">View Applicants</button>
            </div>
          ))}
        </div>

        {/* Applicants Section */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Applicants</h3>
          {applications.length === 0 && <div>No applicants selected</div>}
          {applications.map(a => (
            <div key={a.id} className="p-3 border rounded mt-2">
              <div><strong>Student:</strong> {a.studentId} — <strong>Status:</strong> {a.status}</div>
              <div className="mt-1">
                <button onClick={() => accept(a.id)} className="btn">Accept Student</button>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
