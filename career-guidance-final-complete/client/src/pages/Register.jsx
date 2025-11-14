import React from 'react'
import Nav from '../components/Nav'
import { useForm } from 'react-hook-form'
import { useAuth } from '../services/auth'
import { useNavigate } from 'react-router-dom'
export default function Register(){
  const { register:frm, handleSubmit } = useForm()
  const { register: regUser } = useAuth()
  const nav = useNavigate()
  const onSubmit = async (d)=> { await regUser({email:d.email,password:d.password,role:d.role,displayName:d.name}); alert('Registered - check email for verification'); nav('/login') }
  return (<><Nav/><div className='container'><div className='card max-w-md'><h2>Register</h2><form onSubmit={handleSubmit(onSubmit)}><input {...frm('name')} placeholder='Full name' className='w-full p-2 border'/><input {...frm('email')} placeholder='Email' className='w-full p-2 border mt-2'/><input {...frm('password')} placeholder='Password' type='password' className='w-full p-2 border mt-2'/><select {...frm('role')} className='w-full p-2 border mt-2'><option value='student'>Student</option><option value='institute'>Institute</option><option value='company'>Company</option></select><div style={{marginTop:8}}><button className='btn'>Register</button></div></form></div></div></>)
}