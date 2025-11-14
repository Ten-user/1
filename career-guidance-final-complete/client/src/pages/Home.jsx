import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <div className="container">

        {/* Hero Section */}
        <div className="card text-center py-10 px-6 mb-10 bg-blue-50">
          <h1 className="text-4xl font-bold mb-4">Career Guidance Platform</h1>
          <p className="small text-gray-700 max-w-2xl mx-auto">
            Professional platform connecting students, institutions, and employers. 
            Streamline admissions, career opportunities, and academic progress in a single centralized platform.
            Empower students to make informed decisions and help institutions and companies discover top talent efficiently.
          </p>
        </div>

        {/* Key Features */}
        <div className="card py-8 px-6 mb-10">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>
              <strong>Student Module:</strong> Apply for courses, upload transcripts and certificates, track applications, view admissions results, update profiles, and explore job opportunities tailored to their academic and professional profile.
            </li>
            <li>
              <strong>Institute Module:</strong> Register and manage faculties and courses, review student applications, publish admissions, monitor student status, and manage the institution’s profile with real-time insights.
            </li>
            <li>
              <strong>Company Module:</strong> Post jobs with specific qualifications and requirements, filter applicants automatically based on academic performance, extra certificates, and work experience, and communicate with potential hires directly.
            </li>
            <li>
              <strong>Admin Module:</strong> Approve or suspend institutions and companies, manage faculties and courses, monitor registered users, publish admissions, and generate detailed system reports.
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="card py-8 px-6 mb-10 bg-gray-50">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Our platform centralizes the academic and career ecosystem, simplifying complex processes for students, institutions, and companies.
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-3">
            <li>Students register, upload academic documents and certificates, and explore suitable courses and job opportunities based on their profile.</li>
            <li>Institutions manage faculties, courses, and admissions, making it easier to track student applications and make informed decisions.</li>
            <li>Companies post job openings and receive automatically filtered applicants who meet the required qualifications, certifications, and work experience.</li>
            <li>Administrators maintain the integrity of the platform by monitoring users, verifying institutions and companies, publishing admissions, and generating actionable reports.</li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="card py-8 px-6 mb-10">
          <h2 className="text-3xl font-semibold mb-6">Why Choose This Platform?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Centralized access to academic programs and career opportunities in one place.</li>
            <li>Automated applicant-job matching saves time for employers and enhances recruitment quality.</li>
            <li>Streamlined admissions processes reduce administrative overhead for institutions.</li>
            <li>Students gain insights into potential career paths, job readiness, and academic performance.</li>
            <li>Enhanced transparency and reporting help administrators make data-driven decisions.</li>
          </ul>
        </div>

        {/* Real-World Impact */}
        <div className="card py-8 px-6 mb-10 bg-blue-50">
          <h2 className="text-3xl font-semibold mb-6">Real-World Impact</h2>
          <p className="text-gray-700 mb-4">
            By connecting students, educational institutions, and companies in a single ecosystem, the platform ensures:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Students get personalized guidance for admissions and career opportunities.</li>
            <li>Institutions can manage admissions, courses, and student performance efficiently.</li>
            <li>Companies can easily find qualified candidates, reducing recruitment costs and time.</li>
            <li>Administrators maintain the platform’s quality and generate insights for continuous improvement.</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="card text-center py-10 px-6 bg-gray-100">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="text-gray-700 mb-6">
            Whether you are a student, institution, or employer, our platform empowers your academic and career journey. 
            Join now and unlock new opportunities.
          </p>
          <a href="/register" className="btn px-8 py-3">Register Now</a>
        </div>

      </div>
      <Footer />
    </>
  );
}
