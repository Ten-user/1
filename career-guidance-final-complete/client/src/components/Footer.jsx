import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Career Portal</h2>
          <p className="text-sm">&copy; {new Date().getFullYear()} Career Portal. All rights reserved.</p>
        </div>

        {/* Center: Links */}
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="/" className="hover:text-white text-sm">Home</a>
          <a href="/about" className="hover:text-white text-sm">About</a>
          <a href="/contact" className="hover:text-white text-sm">Contact</a>
          <a href="/privacy" className="hover:text-white text-sm">Privacy Policy</a>
        </div>

        {/* Right side: Social Icons */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
