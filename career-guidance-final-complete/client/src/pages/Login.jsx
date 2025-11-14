import React from 'react'
import Nav from '../components/Nav'
import { useForm } from 'react-hook-form'
import { useAuth } from '../services/auth'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const { register, handleSubmit } = useForm()
  const { login } = useAuth()
  const nav = useNavigate()
  const onSubmit = async d => { await login(d.email,d.password); nav('/') }
  return (<><Nav/><div className='container'><div className='card max-w-md'><h2>Login</h2><form onSubmit={handleSubmit(onSubmit)}><input {...register('email')} placeholder='Email' className='w-full p-2 border'/><input {...register('password')} placeholder='Password' type='password' className='w-full p-2 border mt-2'/><div style={{marginTop:8}}><button className='btn'>Login</button></div></form></div></div></>)
}