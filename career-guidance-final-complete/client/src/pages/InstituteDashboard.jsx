import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { 
  listInstitutions, 
  listCoursesForInstitution, 
  listApplicationsForCourse, 
  updateInstitutionProfile, 
  addCourse, 
  addFaculty, 
  publishAdmission, 
  updateApplicationStatus 
} from '../services/firestore';
import { useAuth } from '../services/auth';

export default function InstituteDashboard() {
  const { profile, user } = useAuth();

  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [newFaculty, setNewFaculty] = useState({ name: '' });
  const [profileData, setProfileData] = useState({ name: '', address: '', email: '' });

  useEffect(() => {
    async function fetchData() {
      if (profile?.institutionId) {
        const inst = (await listInstitutions()).find(x => x.id === profile.institutionId);
        setInstitution(inst);
        setProfileData({ name: inst?.name || '', address: inst?.address || '', email: inst?.email || '' });
        const cs = await listCoursesForInstitution(profile.institutionId);
        setCourses(cs);
        setFaculties(inst?.faculties || []);
      }
    }
    fetchData();
  }, [profile]);

  async function loadApplications(courseId) {
    const apps = await listApplicationsForCourse(courseId);
    setApplications(apps);
  }

  async function accept(appId) {
    try {
      await updateApplicationStatus(appId, 'admitted', user.uid);
      alert('Accepted — other applications cancelled and student notified');
      const cs = await listCoursesForInstitution(profile.institutionId);
      setCourses(cs);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  async function reject(appId) {
    try {
      await updateApplicationStatus(appId, 'rejected', user.uid);
      alert('Application rejected');
      const cs = await listCoursesForInstitution(profile.institutionId);
      setCourses(cs);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  async function handleAddCourse() {
    if (!newCourse.title) return alert('Enter course title');
    await addCourse(profile.institutionId, newCourse);
    alert('Course added');
    setNewCourse({ title: '', description: '' });
    const cs = await listCoursesForInstitution(profile.institutionId);
    setCourses(cs);
  }

  async function handleAddFaculty() {
    if (!newFaculty.name) return alert('Enter faculty name');
    await addFaculty(profile.institutionId, newFaculty);
    alert('Faculty added');
    setNewFaculty({ name: '' });
    setFaculties([...faculties, newFaculty]);
  }

  async function handleUpdateProfile() {
    await updateInstitutionProfile(profileData, profile.institutionId);
    alert('Profile updated');
    setInstitution({ ...institution, ...profileData });
  }

  async function handlePublishAdmissions() {
    await publishAdmission(profile.institutionId);
    alert('Admissions published');
  }

  return (
    <>
      <Nav />
      <div className="container">

        <div className="card">
          <h2>Institute Dashboard</h2>
          <p className="small">Managing: {institution?.name}</p>
        </div>

        {/* Profile Update */}
        <div className="card">
          <h3>Update Institution Profile</h3>
          <input type="text" placeholder="Name" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="p-2 border w-full mb-2"/>
          <input type="text" placeholder="Address" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} className="p-2 border w-full mb-2"/>
          <input type="email" placeholder="Email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="p-2 border w-full mb-2"/>
          <button onClick={handleUpdateProfile} className="btn">Update Profile</button>
        </div>

        {/* Faculties */}
        <div className="card">
          <h3>Manage Faculties</h3>
          <input type="text" placeholder="Faculty Name" value={newFaculty.name} onChange={e => setNewFaculty({ name: e.target.value })} className="p-2 border w-full mb-2"/>
          <button onClick={handleAddFaculty} className="btn">Add Faculty</button>
          <ul className="mt-2">{faculties.map((f, i) => <li key={i}>{f.name}</li>)}</ul>
        </div>

        {/* Courses */}
        <div className="card">
          <h3>Manage Courses</h3>
          <input type="text" placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} className="p-2 border w-full mb-2"/>
          <textarea placeholder="Course Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} className="p-2 border w-full mb-2"/>
          <button onClick={handleAddCourse} className="btn">Add Course</button>

          {courses.map(c => (
            <div key={c.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{c.description}</div>
              <button onClick={() => loadApplications(c.id)} className="btn mt-2">View Applicants</button>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div className="card">
          <h3>Student Applications</h3>
          {applications.map(a => (
            <div key={a.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div><strong>Student:</strong> {a.studentId} — <strong>Status:</strong> {a.status}</div>
              {a.status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => accept(a.id)} className="btn">Accept</button>
                  <button onClick={() => reject(a.id)} className="btn btn-red">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Publish Admissions */}
        <div className="card">
          <h3>Publish Admissions</h3>
          <button onClick={handlePublishAdmissions} className="btn">Publish</button>
        </div>

      </div>
      <Footer />
    </>
  );
}
