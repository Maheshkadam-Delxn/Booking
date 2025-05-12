"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log(formData);
    alert('Your message has been sent successfully!');
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Contact Information */}
            <div className="bg-green-700 p-10 lg:p-16 text-white">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Outdoor Space?</h2>
              <p className="mb-8 text-green-100">
                Get in touch with us today to discuss your landscaping needs and receive a free consultation.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href="tel:+15551234567" className="text-green-100 hover:text-white">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:info@greenscapes.com" className="text-green-100 hover:text-white">
                      info@greenscapes.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <address className="not-italic text-green-100">
                      123 Landscape Lane<br />
                      Greenville, GA 30303
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <ul className="space-y-2 text-green-100">
                  <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                  <li>Saturday: 9:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
            
            {/* Right Column - Contact Form */}
            <div className="p-10 lg:p-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="service" className="block text-gray-700 mb-2">Service Interested In</label>
                  <select 
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="palm-trimming">Palm Trimming</option>
                    <option value="tree-trimming">Tree Trimming</option>
                    <option value="palm-skinning">Palm Skinning</option>
                    <option value="paver-grass">Paver Grass</option>
                    <option value="landscape-design">Landscape Design</option>
                    <option value="irrigation-systems">Irrigation Systems</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 w-full"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm; 