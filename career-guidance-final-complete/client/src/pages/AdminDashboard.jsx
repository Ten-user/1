import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { listInstitutions, listCoursesForInstitution } from '../services/firestore';
import { useAuth } from '../services/auth';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      const insts = await listInstitutions();
      setInstitutions(insts);
      if (insts.length > 0) {
        const cs = await listCoursesForInstitution(insts[0].id);
        setCourses(cs);
      }
    })();
  }, []);

  return (
    <>
      <Nav />
      <div className="container my-10 space-y-10">

        <div className="card p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-700">Manage institutions, courses, and system reports</p>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Institutions</h3>
          {institutions.length === 0 && <div>No institutions added yet</div>}
          {institutions.map(inst => (
            <div key={inst.id} className="p-3 border rounded flex justify-between items-center mt-2">
              <div>{inst.name}</div>
              <button className="btn">Manage</button>
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Courses</h3>
          {courses.length === 0 && <div>No courses added yet</div>}
          {courses.map(c => (
            <div key={c.id} className="p-3 border rounded flex justify-between items-center mt-2">
              <div>{c.title}</div>
              <button className="btn">Manage</button>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
