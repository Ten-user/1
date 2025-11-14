import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../services/auth'
export default function Nav(){
  const { user, profile, logout } = useAuth()
  return (
    <div className="header">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><strong>Career Guidance</strong></div>
        <div>
          <Link to="/" style={{marginRight:12}}>Home</Link>
          {!user && <>
            <Link to="/login" style={{marginRight:12}}>Login</Link>
            <Link to="/register">Register</Link>
          </>}
          {user && profile && <>
            {profile.role==='student' && <Link to="/student" style={{marginLeft:8}}>Student</Link>}
            {profile.role==='institute' && <Link to="/institute" style={{marginLeft:8}}>Institute</Link>}
            {profile.role==='admin' && <Link to="/admin" style={{marginLeft:8}}>Admin</Link>}
            <button onClick={logout} className='btn' style={{marginLeft:12}}>Logout</button>
          </>}
        </div>
      </div>
    </div>
  )
}