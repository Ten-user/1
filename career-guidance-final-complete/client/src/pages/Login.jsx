import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      nav('/');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="container my-10">
        <div className="card max-w-md mx-auto p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="you@example.com"
                className="w-full p-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="********"
                className="w-full p-2 border rounded"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mt-4">
              <button type="submit" className="btn w-full">Login</button>
            </div>

          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account? <a href="/register" className="text-blue-600 underline">Register</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
