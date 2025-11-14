import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { 
  listInstitutions, 
  addInstitution, 
  updateInstitution, 
  deleteInstitution,
  addFaculty,
  addCourse,
  updateCourse,
  deleteCourse,
  listCompanies,
  updateCompanyStatus,
  deleteCompany,
  publishAdmissions,
  listReports
} from '../services/firestore';
import { useAuth } from '../services/auth';

export default function AdminDashboard() {
  const { user, profile } = useAuth();

  const [institutions, setInstitutions] = useState([]);
  const [newInstitution, setNewInstitution] = useState({ name: '', address: '', email: '' });
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newFaculty, setNewFaculty] = useState({ name: '' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const [companies, setCompanies] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const insts = await listInstitutions();
      setInstitutions(insts);

      const comps = await listCompanies();
      setCompanies(comps);

      const rep = await listReports();
      setReports(rep);
    }
    fetchData();
  }, []);

  const handleAddInstitution = async () => {
    if (!newInstitution.name) return alert('Institution name required');
    await addInstitution(newInstitution);
    alert('Institution added');
    setNewInstitution({ name: '', address: '', email: '' });
    setInstitutions(await listInstitutions());
  };

  const handleSelectInstitution = inst => {
    setSelectedInstitution(inst);
    setFaculties(inst.faculties || []);
    setCourses(inst.courses || []);
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name) return alert('Faculty name required');
    await addFaculty(selectedInstitution.id, newFaculty);
    alert('Faculty added');
    setNewFaculty({ name: '' });
    const updated = await listInstitutions();
    setInstitutions(updated);
    handleSelectInstitution(updated.find(i => i.id === selectedInstitution.id));
  };

  const handleAddCourse = async () => {
    if (!newCourse.title) return alert('Course title required');
    await addCourse(selectedInstitution.id, newCourse);
    alert('Course added');
    setNewCourse({ title: '', description: '' });
    const updated = await listInstitutions();
    setInstitutions(updated);
    handleSelectInstitution(updated.find(i => i.id === selectedInstitution.id));
  };

  const handleDeleteInstitution = async id => {
    if (!window.confirm('Are you sure you want to delete this institution?')) return;
    await deleteInstitution(id);
    alert('Institution deleted');
    setInstitutions(await listInstitutions());
    setSelectedInstitution(null);
  };

  const handleDeleteCourse = async courseId => {
    if (!window.confirm('Delete this course?')) return;
    await deleteCourse(selectedInstitution.id, courseId);
    const updated = await listInstitutions();
    setInstitutions(updated);
    handleSelectInstitution(updated.find(i => i.id === selectedInstitution.id));
  };

  const handleCompanyAction = async (companyId, action) => {
    if (action === 'delete' && !window.confirm('Delete this company?')) return;
    if (action === 'delete') await deleteCompany(companyId);
    else await updateCompanyStatus(companyId, action); // approve/suspend
    setCompanies(await listCompanies());
  };

  const handlePublishAdmissions = async () => {
    await publishAdmissions();
    alert('Admissions published');
  };

  return (
    <>
      <Nav />
      <div className="container">

        <div className="card">
          <h2>Admin Dashboard</h2>
          <p className="small">Welcome, {profile?.displayName}</p>
        </div>

        {/* Institutions */}
        <div className="card">
          <h3>Manage Institutions</h3>
          <input type="text" placeholder="Name" value={newInstitution.name} onChange={e => setNewInstitution({ ...newInstitution, name: e.target.value })} className="p-2 border w-full mb-2"/>
          <input type="text" placeholder="Address" value={newInstitution.address} onChange={e => setNewInstitution({ ...newInstitution, address: e.target.value })} className="p-2 border w-full mb-2"/>
          <input type="email" placeholder="Email" value={newInstitution.email} onChange={e => setNewInstitution({ ...newInstitution, email: e.target.value })} className="p-2 border w-full mb-2"/>
          <button onClick={handleAddInstitution} className="btn">Add Institution</button>

          <div className="mt-4">
            {institutions.map(inst => (
              <div key={inst.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
                <div style={{ fontWeight: 600 }}>{inst.name}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{inst.address} | {inst.email}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleSelectInstitution(inst)} className="btn">Select</button>
                  <button onClick={() => handleDeleteInstitution(inst.id)} className="btn btn-red">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculties and Courses */}
        {selectedInstitution && (
          <div className="card">
            <h3>Manage Faculties & Courses for {selectedInstitution.name}</h3>

            {/* Faculties */}
            <h4>Faculties</h4>
            <input type="text" placeholder="Faculty Name" value={newFaculty.name} onChange={e => setNewFaculty({ name: e.target.value })} className="p-2 border w-full mb-2"/>
            <button onClick={handleAddFaculty} className="btn">Add Faculty</button>
            <ul className="mt-2">
              {faculties.map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>

            {/* Courses */}
            <h4 className="mt-4">Courses</h4>
            <input type="text" placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} className="p-2 border w-full mb-2"/>
            <textarea placeholder="Course Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} className="p-2 border w-full mb-2"/>
            <button onClick={handleAddCourse} className="btn">Add Course</button>
            <ul className="mt-2">
              {courses.map(c => (
                <li key={c.id}>
                  {c.title} 
                  <button onClick={() => handleDeleteCourse(c.id)} className="btn btn-red ml-2">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Companies */}
        <div className="card">
          <h3>Manage Companies</h3>
          {companies.map(c => (
            <div key={c.id} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{c.email} | Status: {c.status}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleCompanyAction(c.id, 'approve')} className="btn">Approve</button>
                <button onClick={() => handleCompanyAction(c.id, 'suspend')} className="btn btn-yellow">Suspend</button>
                <button onClick={() => handleCompanyAction(c.id, 'delete')} className="btn btn-red">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Publish Admissions */}
        <div className="card">
          <h3>Publish Admissions</h3>
          <button onClick={handlePublishAdmissions} className="btn">Publish</button>
        </div>

        {/* System Reports */}
        <div className="card">
          <h3>System Reports</h3>
          {reports.length === 0 && <div>No reports yet.</div>}
          {reports.map((r, i) => (
            <div key={i} style={{ padding: 8, border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 8 }}>
              <div><strong>Type:</strong> {r.type}</div>
              <div><strong>Details:</strong> {r.details}</div>
              <div><strong>Date:</strong> {r.date}</div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
