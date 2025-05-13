
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Mail, User, Star, ChevronRight, CreditCard, CalendarPlus, MessageSquare, FileText, MessageCircle, Settings } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

import { useDashboard } from '@/contexts/DashboardContext';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
   const [nextAppointment, setNextAppointment] = useState(null);
   const [pastAppointments, setPastAppointments] = useState([]);
   


  const { userData, isLoading: contextLoading } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyDetails: {
      size: '',
      features: {
        hasFrontYard: false,
        hasBackYard: false,
        hasTrees: false,
        hasGarden: false,
        hasSprinklerSystem: false
      },
      accessInstructions: ''
    },
    servicePreferences: {
      preferredDays: [],
      preferredTimeOfDay: 'Any'
    },
    notificationPreferences: {
      email: false,
      sms: false,
      reminderDaysBefore: 0
    },
    notes: ''
  });



  // Define the calculateDuration function
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = (end - start) / 1000 / 60; // Duration in minutes
  return duration;
}


useEffect(() => {
  const fetchAndFilterAppointment = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    });

    console.log("API Response:", response.data);

    const now = new Date();
    const allAppointments = [];

    // Safely process each appointment
    response.data.data.forEach(appointment => {
      try {
        // Skip if no time slot or invalid data
        if (!appointment?.timeSlot?.startTime) {
          console.warn('Skipping appointment - missing time slot:', appointment);
          return;
        }

        const appointmentDate = new Date(appointment.date);
        
        // Safely parse time
        const timeString = appointment.timeSlot.startTime;
        if (typeof timeString !== 'string') {
          console.warn('Invalid time format:', timeString);
          return;
        }

        // Parse time (handle both "HH:MM AM/PM" and "HH:MM:SS AM/PM" formats)
        const timeParts = timeString.match(/(\d+):(\d+)(?::\d+)?\s*(AM|PM)?/i);
        if (!timeParts) {
          console.warn('Could not parse time:', timeString);
          return;
        }

        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const period = timeParts[3]?.toUpperCase();

        // Convert to 24-hour format if period exists
        if (period) {
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }

        appointmentDate.setHours(hours, minutes, 0, 0);

        allAppointments.push({
          ...appointment,
          fullDateTime: appointmentDate
        });
      } catch (error) {
        console.error('Error processing appointment:', appointment, error);
      }
    });

    // Filter and sort appointments
    const upcoming = allAppointments
      .filter(appointment => appointment.fullDateTime > now)
      .sort((a, b) => a.fullDateTime - b.fullDateTime);

    const past = allAppointments
      .filter(appointment => appointment.fullDateTime <= now)
      .sort((a, b) => b.fullDateTime - a.fullDateTime);

    console.log("Upcoming appointments:", upcoming);
    console.log("Past appointments:", past);

    if (upcoming.length > 0) {
      const next = upcoming[0];
      setNextAppointment({
        _id: next._id,
        name: next.service?.name || 'Unnamed Service',
        category: next.service?.category || 'N/A',
        type: next.packageType || 'Service',
        date: next.date,
        startTime: next.timeSlot.startTime,
        endTime: next.timeSlot.endTime,
        duration: calculateDuration(next.timeSlot.startTime, next.timeSlot.endTime),
        status: next.status || 'Scheduled'
      });
    } else {
      setNextAppointment(null);
    }

    setPastAppointments(past);
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    setError("Failed to load appointments. Please try again later.");
  }
};

  if (userData?.token) {
    fetchAndFilterAppointment();
  }
}, [userData?.token, API_URL]);




  // Fetch user data when userData or contextLoading changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Only fetch if we have userData with token
        if (!userData?.token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/customers/me`, {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        });

        const customerData = response.data.data;
    
        let formattedAddress = '';
        if (typeof customerData.address === 'object' && customerData.address !== null) {
          const addressParts = [];
          if (customerData.address.street) addressParts.push(customerData.address.street);
          if (customerData.address.city) addressParts.push(customerData.address.city);
          if (customerData.address.state) addressParts.push(customerData.address.state);
          if (customerData.address.zipCode) addressParts.push(customerData.address.zipCode);
          if (customerData.address.country) addressParts.push(customerData.address.country);
          formattedAddress = addressParts.join(', ');
        } else if (typeof customerData.address === 'string') {
          formattedAddress = customerData.address;
        }
    
        const transformedUser = {
          name: customerData.user?.name || '',
          email: customerData.user?.email || '',
          phone: customerData.phone || '',
          address: customerData.address || {}, 
          formattedAddress: formattedAddress,
          memberStatus: customerData.memberStatus || 'Standard Member',
          avatar: customerData.avatar || '/avatar.png',
          propertyDetails: customerData.propertyDetails || {
            size: '',
            features: {
              hasFrontYard: false,
              hasBackYard: false,
              hasTrees: false,
              hasGarden: false,
              hasSprinklerSystem: false
            },
            accessInstructions: ''
          },
          properties: customerData.properties || [
            {
              id: 1,
              address: formattedAddress || 'No address provided',
              image: '/property.jpg',
              sqft: customerData.propertyDetails?.size
                ? `${customerData.propertyDetails.size} sq ft`
                : 'N/A',
              tags: customerData.services || ['Lawn Care']
            }
          ],
          nextService: customerData.nextAppointment
            ? {
                type: customerData.nextAppointment.serviceType || 'Service',
                date: new Date(customerData.nextAppointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
                startTime: customerData.nextAppointment.startTime || '9:00 AM',
                endTime: customerData.nextAppointment.endTime || '11:00 AM',
                duration: customerData.nextAppointment.duration || '2 hours'
              }
            : null,
          recentServices:
            customerData.pastAppointments?.map((appointment, index) => ({
              id: index + 1,
              type: appointment.serviceType || 'Service',
              date: new Date(appointment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              rating: appointment.rating || 5,
              image: '/service.jpg',
              completed: true
            })) || []
        };
    
        setUser(transformedUser);
        setFormData({
          name: transformedUser.name,
          email: transformedUser.email,
          phone: transformedUser.phone,
          address: transformedUser.address,
          propertyDetails: transformedUser.propertyDetails,
          servicePreferences: {
            preferredDays: [],
            preferredTimeOfDay: 'Any'
          },
          notificationPreferences: {
            email: false,
            sms: false,
            reminderDaysBefore: 0
          },
          notes: ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to fetch user data');
        setLoading(false);
      }
    };

    // Only fetch if context is done loading and we have userData
    if (!contextLoading && userData) {
      fetchUserData();
    }
  }, [userData, contextLoading]); // Add dependencies here

  // Early returns for loading and auth states
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">Please log in to view this page.</span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">No user data available.</span>
        </div>
      </div>
    );
  }





 
 

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   if (type === 'checkbox') {
  //     if (name.includes('.')) {
  //       const [parent, child, subChild] = name.split('.');
  //       if (subChild) {
  //         setFormData(prev => ({
  //           ...prev,
  //           [parent]: {
  //             ...prev[parent],
  //             [child]: {
  //               ...prev[parent][child],
  //               [subChild]: checked
  //             }
  //           }
  //         }));
  //       } else {
  //         setFormData(prev => ({
  //           ...prev,
  //           [parent]: {
  //             ...prev[parent],
  //             [child]: checked
  //           }
  //         }));
  //       }
  //     } else {
  //       setFormData(prev => ({
  //         ...prev,
  //         [name]: checked
  //       }));
  //     }
  //   } else if (name.includes('.')) {
  //     const [parent, child, subChild] = name.split('.');
  //     if (subChild) {
  //       setFormData(prev => ({
  //         ...prev,
  //         [parent]: {
  //           ...prev[parent],
  //           [child]: {
  //             ...prev[parent][child],
  //             [subChild]: value
  //           }
  //         }
  //       }));
  //     } else {
  //       setFormData(prev => ({
  //         ...prev,
  //         [parent]: {
  //           ...prev[parent],
  //           [child]: value
  //         }
  //       }));
  //     }
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // };

  // const handleMultiSelect = (e) => {
  //   const { options } = e.target;
  //   const selectedValues = [];
    
  //   for (let i = 0; i < options.length; i++) {
  //     if (options[i].selected) {
  //       selectedValues.push(options[i].value);
  //     }
  //   }
    
  //   setFormData(prev => ({
  //     ...prev,
  //     servicePreferences: {
  //       ...prev.servicePreferences,
  //       preferredDays: selectedValues
  //     }
  //   }));
  // };

  const handleSave = async () => {
    try {
      if (!userData?.token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await axios.put(`${API_URL}/auth/updatedetails`, 
        {
          user: {
            name: formData.name,
            email: formData.email
          },
          phone: formData.phone,
          address: formData.address,
          propertyDetails: formData.propertyDetails,
          servicePreferences: formData.servicePreferences,
          notificationPreferences: formData.notificationPreferences,
          notes: formData.notes
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        }
      );
  
      let formattedAddress = formData.address;
      if (typeof formData.address === 'object' && formData.address !== null) {
        const addressParts = [];
        if (formData.address.street) addressParts.push(formData.address.street);
        if (formData.address.city) addressParts.push(formData.address.city);
        if (formData.address.state) addressParts.push(formData.address.state);
        if (formData.address.zipCode) addressParts.push(formData.address.zipCode);
        if (formData.address.country) addressParts.push(formData.address.country);
        formattedAddress = addressParts.join(', ');
      }
  
      setUser(prev => ({
        ...prev,
        name: response.data.user?.name || formData.name,
        email: response.data.user?.email || formData.email,
        phone: formData.phone,
        address: formData.address,
        formattedAddress: formattedAddress,
        propertyDetails: formData.propertyDetails,
        properties: [{
          ...prev.properties[0],
          address: formattedAddress || 'No address provided',
          sqft: formData.propertyDetails?.size 
            ? `${formData.propertyDetails.size} sq ft` 
            : 'N/A'
        }]
      }));
      
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const placeholderImages = {
    avatar: "https://via.placeholder.com/80/22c55e/ffffff?text=MA",
    property: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    garden: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-green-400 text-green-400" : "text-gray-300"}
      />
    ));
  };

  return (
   <div className="min-h-screen">
  {/* Profile Header */}
  {/* <div className="bg-green-600 text-lg text-white p-6"> */}
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-center md:justify-start">
        <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-4xl font-bold mr-4">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <div className="flex items-center justify-center md:justify-start text-gray-500">
            <Mail size={16} className="mr-2" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  {/* </div> */}

  {/* Main Content Area */}
  <div className="max-w-6xl mx-auto p-6">
    {/* Next Service Card - Full Width */}
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
      <div className="bg-green-600 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="mr-2" size={18} />
          Next Scheduled Service
        </h2>
      </div>
      <div className="p-4">
  {nextAppointment ? (
    <div className="md:flex items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <Calendar className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{nextAppointment.name}</h3>
          <p className="text-sm text-gray-600">{nextAppointment.category}</p> 
         <p className="text-sm text-gray-600">
  {new Date(nextAppointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-sm text-green-600 font-medium">Time</p>
          <p className="text-gray-700">
            {nextAppointment.startTime} - {nextAppointment.endTime}
          </p>
        </div>
        {/* <div>
          <p className="text-sm text-green-600 font-medium">Duration</p>
          <p className="text-gray-700">{nextAppointment.duration}</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
          View Details
        </button> */}
      </div>
    </div>
  ) : (
    <div className="text-center py-6">
      <div className="bg-green-100 p-4 rounded-lg inline-block mb-3">
        <Calendar className="text-green-600 mx-auto" size={24} />
      </div>
      <h3 className="text-gray-500 mb-2">No upcoming services</h3>
      <button className="text-green-600 hover:text-green-800 font-medium">
        Schedule a Service
      </button>
    </div>
  )}
</div>
    </div>

    {/* Personal Info and Property Cards - 2 columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Personal Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="bg-green-500 text-white p-4">
          <h2 className="text-lg font-semibold flex items-center">
            <User className="mr-2" size={18} />
            Personal Information
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-green-600 font-medium">Full Name</p>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Email</p>
            <p className="text-gray-700">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-sm text-green-600 font-medium">Phone</p>
              <p className="text-gray-700">{user.phone}</p>
            </div>
          )}
          {/* <div>
            <p className="text-sm text-green-600 font-medium">Address</p>
            <p className="text-gray-700">
              {user.formattedAddress || "No address provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Member Status</p>
            <p className="text-gray-700">{user.memberStatus}</p>
          </div> */}
        </div>
      </div>

      {/* Property Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="bg-green-600 text-white p-4">
          <h2 className="text-lg font-semibold flex items-center">
            <MapPin className="mr-2" size={18} />
            Property Overview
          </h2>
        </div>
        <div className="p-4">
          <div className="relative h-40 rounded-lg overflow-hidden mb-4">
            <img 
              src={placeholderImages.property}
              alt="Property" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent flex items-end p-4">
              <h3 className="text-white font-medium">Primary Property</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-green-600 font-medium">Address</p>
              <p className="text-gray-700">{user.properties[0].address}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Size</p>
                <p className="text-gray-700">{user.properties[0].sqft}</p>
              </div>
              {/* <div>
                <p className="text-sm text-green-600 font-medium">Services</p>
                <p className="text-gray-700">{user.properties[0].tags.length}</p>
              </div> */}
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center text-green-600 hover:text-green-800 font-medium">
            <span>View Property Details</span>
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>

    {/* Recent Services Card */}
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
      <div className="bg-green-600 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2" size={18} />
          Recent Service History
        </h2>
      </div>
      <div className="p-4">
  {pastAppointments.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-green-100">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Service</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Date</th>
            {/* <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Rating</th> */}
            <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-green-100">
          {pastAppointments.map((service) => (
            <tr key={service._id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg overflow-hidden mr-3">
                    <img
                      src={placeholderImages.garden}
                      alt={service.packageType || 'Service'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{service.service?.name || 'Service'}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(service.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
             
              <td className="px-4 py-3 whitespace-nowrap">
               <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
      ${service.status === 'Completed' ? 'bg-green-100 text-green-800' :
        service.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
        service.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'}`}>
    {service.status}
  </span>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-center py-8">
      <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
        <Calendar className="text-green-600" size={24} />
      </div>
      <h3 className="text-gray-500">No recent services found</h3>
    </div>
  )}
</div>

    </div>

    {/* Quick Actions Section */}
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
      <div className="bg-green-600 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <CalendarPlus className="mr-2" size={18} />
          Quick Actions
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/booking" className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
        <CalendarPlus className="text-green-600 mb-2" size={24} />
        <span className="text-sm font-medium text-gray-700">Schedule Service</span>
      </Link>

      <Link href="/contact" className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
       <MessageSquare className="text-green-600 mb-2" size={24} />
        <span className="text-sm font-medium text-gray-700">Contact Support</span>
      </Link>

          
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <CreditCard className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Make Payment</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Settings className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Account Settings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  )};