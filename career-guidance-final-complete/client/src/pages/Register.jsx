import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register: frm, handleSubmit, formState: { errors } } = useForm();
  const { register: regUser } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      await regUser({
        email: data.email,
        password: data.password,
        role: data.role,
        displayName: data.name
      });
      alert('Registered successfully - check your email for verification');
      nav('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="container my-10">
        <div className="card max-w-md mx-auto p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input 
                {...frm('name', { required: 'Full name is required' })} 
                placeholder="John Doe" 
                className="w-full p-2 border rounded" 
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input 
                {...frm('email', { required: 'Email is required' })} 
                type="email" 
                placeholder="you@example.com" 
                className="w-full p-2 border rounded" 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input 
                {...frm('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} 
                type="password" 
                placeholder="********" 
                className="w-full p-2 border rounded" 
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select 
                {...frm('role', { required: 'Select a role' })} 
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Role --</option>
                <option value="student">Student</option>
                <option value="institute">Institute</option>
                <option value="company">Company</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <div className="mt-4">
              <button type="submit" className="btn w-full">Register</button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
