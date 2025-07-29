import React from 'react';

const AboutLIMS: React.FC = () => (
  <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md mt-10 relative">
    <img src="/image.png" alt="Rifah Labs Logo" className="w-24 h-24 absolute top-0 right-0 opacity-10 pointer-events-none select-none" />
    <h1 className="text-3xl font-bold text-blue-800 mb-4">About Rifah LIMS</h1>
    <p className="text-gray-700 mb-4">
      <strong>Rifah LIMS</strong> is a modern Laboratory Information Management System designed for medical labs, clinics, and diagnostic centers. It streamlines patient management, test reporting, invoicing, analytics, and more—all in one secure, user-friendly platform.
    </p>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Mission Statement</h2>
      <p className="text-gray-700">Empowering healthcare providers with efficient, reliable, and innovative laboratory management solutions for better patient outcomes.</p>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Features</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Comprehensive Patient Management</li>
        <li>Automated Invoicing & Billing</li>
        <li>Advanced Test Reporting & Analytics</li>
        <li>Role-based Access Control</li>
        <li>Stock & Expense Management</li>
        <li>Notifications & Alerts</li>
        <li>Customizable Rate Lists</li>
        <li>Audit Trails & Compliance</li>
        <li>Modern, Responsive UI</li>
      </ul>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Team & Contributors</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Lead Developer: <a href="https://github.com/m.mattiulhasnain" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">m.mattiulhasnain</a></li>
        <li>GitHub (2nd Account): <a href="https://github.com/mattiulhasnain" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">mattiulhasnain</a></li>
      </ul>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h2>
      <ul className="text-gray-700">
        <li>Email: <a href="mailto:MUHIUM@gmail.com" className="text-blue-600 underline">MUHIUM@gmail.com</a></li>
        <li>Phone: <a href="tel:+923297115355" className="text-blue-600 underline">+92 329 7115355</a></li>
        <li>Website: <a href="https://sahiwal.tech" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">sahiwal.tech</a></li>
      </ul>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Changelog / Version History</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>v1.0.0 – Initial release with full LIMS workflow, reporting, and analytics</li>
        <li>Ongoing – Continuous improvements, bug fixes, and new features</li>
      </ul>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Helpful Links</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li><a href="https://github.com/m.mattiulhasnain" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">GitHub (m.mattiulhasnain)</a></li>
        <li><a href="https://github.com/mattiulhasnain" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">GitHub (mattiulhasnain)</a></li>
        <li><a href="https://sahiwal.tech" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Developer Website</a></li>
      </ul>
    </div>
    <div className="mt-6 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} MUHIUM dev. All rights reserved.
    </div>
  </div>
);

export default AboutLIMS; 