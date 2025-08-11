import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DBU</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Student Union</h3>
                <p className="text-gray-400 text-sm">Debre Berhan University</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering students through leadership, service, and academic excellence 
              at Debre Berhan University.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">📱</a>
              <a href="#" className="text-gray-400 hover:text-white">📘</a>
              <a href="#" className="text-gray-400 hover:text-white">💬</a>
              <a href="#" className="text-gray-400 hover:text-white">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/elections" className="text-gray-400 hover:text-white">Elections</Link></li>
              <li><Link to="/clubs" className="text-gray-400 hover:text-white">Clubs</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
              <li><Link to="/latest" className="text-gray-400 hover:text-white">Latest News</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>DBU Campus, Student Union Building</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>studentunion@dbu.edu.et</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+251940414243</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Debre Berhan University Student Union. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}