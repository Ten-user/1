import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { listInstitutions, listCoursesForInstitution, listApplicationsForCourse } from '../services/firestore'
import { useAuth } from '../services/auth'

export default function InstituteDashboard(){
  const { profile, user } = useAuth()
  const [institution, setInstitution] = useState(null)
  const [courses, setCourses] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(()=>{ (async ()=>{ if(profile?.institutionId){ const inst = (await listInstitutions()).find(x=>x.id===profile.institutionId); setInstitution(inst); const cs = await listCoursesForInstitution(profile.institutionId); setCourses(cs)} })() },[profile])

  async function loadApplications(courseId){
    const apps = await listApplicationsForCourse(courseId)
    setApplications(apps)
  }

  async function accept(appId){
    // call cloud function endpoint to accept
    const url = '/__/functions/acceptAdmission' // firebase local callable path or replace with real function URL after deploy
    const res = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({applicationId:appId, instituteAdminUid:user.uid})})
    const data = await res.json()
    if(data.ok) alert('Accepted — other applications cancelled and student notified')
    else alert('Failed: '+(data.message||''))
    const cs = await listCoursesForInstitution(profile.institutionId)
    setCourses(cs)
  }

  return (<><Nav/><div className='container'><div className='card'><h2>Institute Panel</h2><p className='small'>Viewing data for: {institution?.name}</p></div><div className='card'><h3>Courses</h3>{courses.length===0 && <div>No courses yet.</div>}{courses.map(c=>(<div key={c.id} style={{padding:8,border:'1px solid #e2e8f0',borderRadius:6,marginTop:8}}><div style={{fontWeight:600}}>{c.title}</div><div style={{fontSize:12,color:'#475569'}}>{c.description}</div><div style={{marginTop:8}}><button onClick={()=>loadApplications(c.id)} className='btn'>View Applicants</button></div></div>))}</div><div className='card'><h3>Applicants</h3>{applications.length===0 && <div>No applicants selected</div>}{applications.map(a=>(<div key={a.id} style={{padding:8,border:'1px solid #e2e8f0',borderRadius:6,marginTop:8}}><div><strong>Student:</strong> {a.studentId} — <strong>Status:</strong> {a.status}</div><div style={{marginTop:6}}><button onClick={()=>accept(a.id)} className='btn'>Accept student</button></div></div>))}</div></div></>) }
