// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import useStore from '../../lib/store';
// import Card from '../ui/Card';
// import Button from '../ui/Button';
// import axios from "axios";


// const ActivityLog = ({ activities }) => {
//   return (
//     <div className="flow-root">
//       <ul className="-mb-8">
//         {activities.map((activity, activityIdx) => (
//           <li key={activity.id}>
//             <div className="relative pb-8">
//               {activityIdx !== activities.length - 1 ? (
//                 <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
//               ) : null}
//               <div className="relative flex space-x-3">
//                 <div>
//                   <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconBackground}`}>
//                     <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                       <path fillRule="evenodd" d={activity.icon} clipRule="evenodd" />
//                     </svg>
//                   </span>
//                 </div>
//                 <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                   <div>
//                     <p className="text-sm text-gray-500">
//                       {activity.content}{' '}
//                       <span className="font-medium text-gray-900">{activity.target}</span>
//                     </p>
//                   </div>
//                   <div className="text-right text-sm whitespace-nowrap text-gray-500">
//                     <time dateTime={activity.datetime}>{activity.date}</time>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const CalendarOverview = ({ appointments }) => {
//   const upcomingAppointments = appointments
//     .filter(a => a.status === 'scheduled')
//     .sort((a, b) => new Date(a.date) - new Date(b.date))
//     .slice(0, 5);

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="p-4 bg-green-50 border-b border-gray-200">
//         <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
//       </div>
//       {upcomingAppointments.length === 0 ? (
//         <div className="p-4 text-gray-500 text-center">No upcoming appointments</div>
//       ) : (
//         <ul className="divide-y divide-gray-200">
//           {upcomingAppointments.map((appointment) => (
//             <li key={appointment.id} className="p-4 hover:bg-gray-50">
//               <Link href={`/admin/appointments/${appointment.id}`} className="block">
//                 <div className="flex flex-col sm:flex-row sm:justify-between">
//                   <p className="text-sm font-medium text-gray-900 mb-1 sm:mb-0">{appointment.customerName}</p>
//                   <p className="text-sm text-gray-500">{appointment.date}</p>
//                 </div>
//                 <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
//                   <p className="text-sm text-gray-500">{appointment.serviceName}</p>
//                   <p className="text-sm text-gray-500">{appointment.timeSlot}</p>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//       <div className="bg-gray-50 px-4 py-3 text-right">
//         <Link href="/admin/appointments" className="text-sm font-medium text-green-600 hover:text-green-500">
//           View all appointments &rarr;
//         </Link>
//       </div>
//     </div>
//   );
// };

// const getBarChartData = () => {
//   return [
//     { month: 'Jan', value: 12 },
//     { month: 'Feb', value: 15 },
//     { month: 'Mar', value: 18 },
//     { month: 'Apr', value: 22 },
//     { month: 'May', value: 28 },
//     { month: 'Jun', value: 35 },
//     { month: 'Jul', value: 40 },
//     { month: 'Aug', value: 38 },
//     { month: 'Sep', value: 30 },
//     { month: 'Oct', value: 25 },
//     { month: 'Nov', value: 20 },
//     { month: 'Dec', value: 18 },
//   ];
// };

// const BarChart = ({ data, title }) => {
//   const maxValue = Math.max(...data.map(item => item.value));
  
//   return (
//     <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//       <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
//       <div className="flex items-end space-x-2 h-48 min-w-[600px]">
//         {data.map((item, index) => (
//           <div key={index} className="flex flex-col items-center flex-1">
//             <div 
//               className="w-full bg-green-500 rounded-t"
//               style={{ height: `${(item.value / maxValue) * 100}%` }}
//             ></div>
//             <div className="text-xs text-gray-500 mt-1 truncate">{item.month}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const { appointments, estimates, services } = useStore();
//   const [timeRange, setTimeRange] = useState('week');
//   const [token, setToken] = useState('');
//   const [decodedToken, setDecodedToken] = useState(null);


// const [message, setMessage] = useState("");
//   const [active, setActive] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


//     // Add this line to check admin status
//   const isAdmin = decodedToken?.role === 'admin';





//   useEffect(() => {
//     // Fetch current message from server
//     axios.get(`${API_URL}/message`)
//       .then((response) => {
//         if (response.data) {
//           setMessage(response.data.content);
//           setActive(response.data.active);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching message:", error);
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//        `${API_URL}/message`,
//         { content: message, active },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//           },
//         }
//       );
//       alert("Message updated successfully!");
//       setShowForm(false); // Hide form after submit
//     } catch (error) {
//       console.error("Error updating message:", error);
//       alert("Failed to update message.");
//     }
//   };





  
//   useEffect(() => {
//     const storedToken = localStorage.getItem('authToken');
//     setToken(storedToken || 'No token found');
    
//     if (storedToken) {
//       try {
//         const decoded = JSON.parse(atob(storedToken.split('.')[1]));
//         setDecodedToken(decoded);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setDecodedToken(null);
//       }
//     }
//   }, []);

//   const recentActivities = [
//     {
//       id: 1,
//       content: 'Created a new estimate for',
//       target: 'Robert Davis',
//       date: 'Just now',
//       datetime: '2023-05-18T19:00',
//       icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
//       iconBackground: 'bg-green-500',
//     },
//     {
//       id: 2,
//       content: 'Completed appointment with',
//       target: 'James Wilson',
//       date: '1 hour ago',
//       datetime: '2023-05-18T18:00',
//       icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
//       iconBackground: 'bg-blue-500',
//     },
//     {
//       id: 3,
//       content: 'Added a new service',
//       target: 'Seasonal Cleanup',
//       date: '2 hours ago',
//       datetime: '2023-05-18T16:00',
//       icon: 'M6 5V4c0-1.1.9-2 2-2h8a2 2 0 012 2v1h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7c0-1.1.9-2 2-2h2zm0 1H4v12h16V7h-3v1c0 .6-.4 1-1 1H8a1 1 0 01-1-1V7H6v-.5z',
//       iconBackground: 'bg-purple-500',
//     },
//   ];

//   const appointmentCounts = {
//     total: appointments.length,
//     pending: appointments.filter(a => a.status === 'pending-estimate').length,
//     scheduled: appointments.filter(a => a.status === 'scheduled').length,
//     completed: appointments.filter(a => a.status === 'completed').length,
//   };
  
//   const estimateCounts = {
//     total: estimates.length,
//     pending: estimates.filter(e => e.status === 'pending').length,
//     approved: estimates.filter(e => e.status === 'approved').length,
//     rejected: estimates.filter(e => e.status === 'rejected').length,
//   };

//   const barChartData = getBarChartData();
  
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 py-6">


//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
//         </div>
//         <div className="mt-4 sm:mt-0 flex space-x-3">
//           {/* <Link href="/admin/appointments/new">
//             <Button variant="primary" size="sm" className="w-full sm:w-auto">
//               New Appointment
//             </Button>
//           </Link> */}
//           {isAdmin && (
//     <Link href="/admin/services/new">
//       <Button variant="secondary" size="sm">Add Service</Button>
//     </Link>
//   )}

//    <div>
 

//       {/* {!showForm && (
//         <button onClick={() => setShowForm(true)}>Add Message</button>
//       )}

//       {showForm && (
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Message Content</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={active}
//                 onChange={() => setActive(!active)}
//               />
//               Active
//             </label>
//           </div>
//           <button type="submit">Update Message</button>
//           <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
//         </form>
//       )} */}
//     </div>


//         </div>
//       </div>

//             {/* Quick Actions */}
//             <div className="bg-white p-4 rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
//           <Link href="/admin/appointments">
//             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
//               <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">View All Appointments</span>
//             </div>
//           </Link>
//           <Link href="/admin/customers">
//             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
//               <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Customers</span>
//             </div>
//           </Link>
//           <Link href="/admin/services">
//             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
//               <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Services</span>
//             </div>
//           </Link>
//           <Link href="/admin/staff">
//             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
//               <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Staff</span>
//             </div>
//           </Link>
//           <Link href="/admin/settings">
//             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
//               <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Settings</span>
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Time range selector */}
//       <div className="mb-6 bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
//         <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Overview</h2>
//         <div className="flex space-x-2 w-full sm:w-auto">
//           <button
//             onClick={() => setTimeRange('week')}
//             className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
//               timeRange === 'week'
//                 ? 'bg-green-100 text-green-800'
//                 : 'text-gray-500 hover:bg-gray-100'
//             }`}
//           >
//             Week
//           </button>
//           <button
//             onClick={() => setTimeRange('month')}
//             className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
//               timeRange === 'month'
//                 ? 'bg-green-100 text-green-800'
//                 : 'text-gray-500 hover:bg-gray-100'
//             }`}
//           >
//             Month
//           </button>
//           <button
//             onClick={() => setTimeRange('year')}
//             className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
//               timeRange === 'year'
//                 ? 'bg-green-100 text-green-800'
//                 : 'text-gray-500 hover:bg-gray-100'
//             }`}
//           >
//             Year
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <Card.Content className="text-center p-4 sm:p-6">
//             <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-100 rounded-full">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Total Appointments</h2>
//             <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{appointmentCounts.total}</p>
//             <p className="mt-1 text-xs sm:text-sm text-gray-500">From all time</p>
//           </Card.Content>
//         </Card>
        
//         <Card>
//           <Card.Content className="text-center p-4 sm:p-6">
//             <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-yellow-100 rounded-full">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Pending Estimates</h2>
//             <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-yellow-600">{appointmentCounts.pending}</p>
//             <p className="mt-1 text-xs sm:text-sm text-gray-500">Needs attention</p>
//           </Card.Content>
//         </Card>
        
//         <Card>
//           <Card.Content className="text-center p-4 sm:p-6">
//             <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-blue-100 rounded-full">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//             </div>
//             <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Services Offered</h2>
//             <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-blue-600">{services.length}</p>
//             <p className="mt-1 text-xs sm:text-sm text-gray-500">Active services</p>
//           </Card.Content>
//         </Card>
        
//         <Card>
//           <Card.Content className="text-center p-4 sm:p-6">
//             <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-100 rounded-full">
//               <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Completed Jobs</h2>
//             <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-green-600">{appointmentCounts.completed}</p>
//             <p className="mt-1 text-xs sm:text-sm text-gray-500">Successfully completed</p>
//           </Card.Content>
//         </Card>
//       </div>

//       {/* Charts and Activity Log */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
//         <div className="lg:col-span-2">
//           <BarChart 
//             data={barChartData} 
//             title={timeRange === 'week' ? 'Weekly Appointments' : timeRange === 'month' ? 'Monthly Appointments' : 'Yearly Appointments'} 
//           />
//         </div>
//         <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
//             <ActivityLog activities={recentActivities} />
//             <div className="mt-4 text-right">
//               <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
//                 View all activity &rarr;
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upcoming Appointments */}
//       <div className="mb-6">
//         <CalendarOverview appointments={appointments} />
//       </div>


//     </div>
//   );
// };

// export default Dashboard;





'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '../../lib/store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import axios from "axios";
import { useDashboard } from '../../contexts/DashboardContext';

const ActivityLog = ({ activities }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconBackground}`}>
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d={activity.icon} clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {activity.content}{' '}
                      <span className="font-medium text-gray-900">{activity.target}</span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={activity.datetime}>{activity.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CalendarOverview = ({ appointments }) => {
  // Process appointments to include full datetime
  const processedAppointments = appointments.map(appointment => {
    if (!appointment?.date || !appointment?.timeSlot?.startTime) {
      console.warn("Invalid appointment data:", appointment);
      return null;
    }

    try {
      // Create date object from appointment date string
      const appointmentDate = new Date(appointment.date);
      
      // Parse time string (handle both "HH:MM" and "HH:MM:SS" formats)
      const timeString = appointment.timeSlot.startTime;
      const timeParts = timeString.match(/(\d+):(\d+)(?::\d+)?/);
      if (!timeParts) {
        console.warn("Could not parse time:", timeString);
        return null;
      }

      const hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);

      // Set hours and minutes on the date object
      appointmentDate.setHours(hours, minutes, 0, 0);

      return {
        ...appointment,
        fullDateTime: appointmentDate
      };
    } catch (error) {
      console.error("Error processing appointment:", appointment, error);
      return null;
    }
  }).filter(Boolean); // Remove any null entries from invalid appointments

  // Filter and sort appointments
  const now = new Date();
  const upcomingAppointments = processedAppointments
    .filter(a => a.status === 'Scheduled' && a.fullDateTime > now)
    .sort((a, b) => a.fullDateTime - b.fullDateTime)
    .slice(0, 5); // Limit to 5 upcoming appointments

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-green-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
      </div>
      {upcomingAppointments.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">No upcoming appointments</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {upcomingAppointments.map((appointment) => (
            <li key={appointment._id} className="p-4 hover:bg-gray-50">
              <Link href={`/admin/appointments/${appointment._id}`} className="block">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <p className="text-sm font-medium text-gray-900 mb-1 sm:mb-0">
                    {appointment.customer?.user?.name || 'Unknown Customer'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.fullDateTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                  <p className="text-sm text-gray-500">
                    {appointment.service?.name || 'Unknown Service'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="bg-gray-50 px-4 py-3 text-right">
        <Link href="/admin/appointments" className="text-sm font-medium text-green-600 hover:text-green-500">
          View all appointments &rarr;
        </Link>
      </div>
    </div>
  );
};

const StatusPieChart = ({ data }) => {
  const colors = {
    'Scheduled': '#10B981',
    'Rescheduled': '#F59E0B',
    'Completed': '#3B82F6',
    'Cancelled': '#EF4444',
    'No-Show': '#8B5CF6'
  };

  // Calculate total count for percentage calculations
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments by Status</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 md:mb-0 md:mr-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {data.reduce((acc, item, index) => {
              const prevPercent = acc.prevPercent;
              const percent = (item.count / total) * 100;
              const dashArray = `${percent} ${100 - percent}`;
              const dashOffset = -prevPercent;
              
              acc.elements.push(
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={colors[item._id] || '#999'}
                  strokeWidth="10"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 50 50)"
                />
              );
              
              acc.prevPercent += percent;
              return acc;
            }, { elements: [], prevPercent: 0 }).elements}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item._id} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: colors[item._id] || '#999' }}
              ></div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">{item._id}:</span> {item.count} (
                {total > 0 ? Math.round((item.count / total) * 100) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DayOfWeekChart = ({ data }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const maxCount = Math.max(...data.map(item => item.count), 1);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments by Day of Week</h3>
      <div className="flex flex-col space-y-3">
        {days.map((day, index) => {
          const dayData = data.find(item => item._id === index + 1) || { count: 0 };
          return (
            <div key={day} className="flex items-center">
              <div className="w-24 text-sm text-gray-500">{day}</div>
              <div className="flex-1 flex items-center">
                <div 
                  className="h-6 bg-green-500 rounded mr-2" 
                  style={{ width: `${(dayData.count / maxCount) * 100}%` }}
                ></div>
                <div className="text-sm font-medium">{dayData.count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthlyTrendChart = ({ data }) => {
  // Month labels
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get current year
  const currentYear = new Date().getFullYear();

  // Initialize all months with count 0
  const monthlyData = months.map((month, index) => ({
    month,
    count: 0,
    monthNumber: index + 1 // 1-12
  }));

  // Process backend data
  if (data && data.length > 0) {
    data.forEach(item => {
      // Only process data for current year
      if (item._id.year === currentYear) {
        const monthIndex = item._id.month - 1; // Convert to 0-based index
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].count = item.count;
        }
      }
    });
  }

  // Calculate max count for scaling
  const maxCount = Math.max(...monthlyData.map(item => item.count), 1);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Monthly Appointment Trends ({currentYear})
      </h3>
      <div className="flex items-end space-x-1 h-48">
        {monthlyData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                minHeight: item.count > 0 ? '2px' : '0' // Ensure zero counts are visible
              }}
              title={`${item.month}: ${item.count} appointment${item.count !== 1 ? 's' : ''}`}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.month}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Total: {monthlyData.reduce((sum, month) => sum + month.count, 0)}</span>
        <span>Max: {maxCount} in {months[monthlyData.findIndex(m => m.count === maxCount)]}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { appointments, estimates, services } = useStore();
  const [timeRange, setTimeRange] = useState('month'); // Default to month
  const { userData } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State for fetched data
  const [appointmentData, setAppointmentData] = useState([]);
  const [estimateData, setEstimateData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingEstimates: 0,
    totalServices: 0,
    completedAppointments: 0
  });
  const [appointmentStats, setAppointmentStats] = useState({
    byStatus: [],
    byDayOfWeek: [],
    byMonth: [],
    completionRate: 0
  });

  useEffect(() => {
    const fetchAppointmentStats = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/dashboard/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAppointmentStats({
          byStatus: response.data.data.appointmentsByStatus || [],
          byDayOfWeek: response.data.data.appointmentsByDayOfWeek || [],
          byMonth: response.data.data.appointmentsByMonth || [],
          completionRate: response.data.data.completionRate || 0
        });
      } catch (error) {
        console.error('Error fetching appointment stats:', error);
        setAppointmentStats({
          byStatus: [],
          byDayOfWeek: [],
          byMonth: [],
          completionRate: 0
        });
      }
    };

    fetchAppointmentStats();
  }, [API_URL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        // Fetch appointments
        const appointmentsRes = await axios.get(`${API_URL}/appointments?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointmentData(appointmentsRes.data.data || []);
        
        // Fetch estimates
        const estimatesRes = await axios.get(`${API_URL}/estimates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstimateData(estimatesRes.data.data || []);
        
        // Fetch services
        const servicesRes = await axios.get(`${API_URL}/services`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServiceData(servicesRes.data.data || []);

        // Calculate stats
        setStats({
          totalAppointments: appointmentsRes.data.data?.length || 0,
          pendingEstimates: estimatesRes.data.data?.filter(e => e.status === 'pending')?.length || 0,
          totalServices: servicesRes.data.data?.length || 0,
          completedAppointments: appointmentsRes.data.data?.filter(a => a.status === 'Completed')?.length || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const recentActivities = [
    {
      id: 1,
      content: 'Created a new estimate for',
      target: 'Robert Davis',
      date: 'Just now',
      datetime: '2023-05-18T19:00',
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
      iconBackground: 'bg-green-500',
    },
    {
      id: 2,
      content: 'Completed appointment with',
      target: 'James Wilson',
      date: '1 hour ago',
      datetime: '2023-05-18T18:00',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      iconBackground: 'bg-blue-500',
    },
    {
      id: 3,
      content: 'Added a new service',
      target: 'Seasonal Cleanup',
      date: '2 hours ago',
      datetime: '2023-05-18T16:00',
      icon: 'M6 5V4c0-1.1.9-2 2-2h8a2 2 0 012 2v1h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7c0-1.1.9-2 2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      iconBackground: 'bg-purple-500',
    },
  ];
  
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userData?.name}! Here's what's happening with your business.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {userData?.role === 'admin' && (
            <Link href="/admin/services/new">
              <Button variant="secondary" size="sm">Add Service</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          <Link href="/admin/appointments">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">View All Appointments</span>
            </div>
          </Link>
          <Link href="/admin/customers">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Customers</span>
            </div>
          </Link>
          <Link href="/admin/services">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Services</span>
            </div>
          </Link>
          <Link href="/admin/staff">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Manage Staff</span>
            </div>
          </Link>
          <Link href="/admin/settings">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="block mt-2 text-xs sm:text-sm font-medium text-gray-900">Settings</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Time range selector */}
      {/* <div className="mb-6 bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Overview</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'week'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'month'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'year'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
        <Card>
          <Card.Content className="text-center p-4 sm:p-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Total Appointments</h2>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-green-600">{stats.totalAppointments}</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">From all time</p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center p-4 sm:p-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-yellow-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Pending Estimates</h2>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pendingEstimates}</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Needs attention</p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center p-4 sm:p-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-blue-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Services Offered</h2>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalServices}</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Active services</p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center p-4 sm:p-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-3 text-base sm:text-lg font-medium text-gray-700">Completion Rate</h2>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-green-600">
              {appointmentStats.completionRate}%
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Appointments completed</p>
          </Card.Content>
        </Card>
      </div>

      {/* Charts and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {appointmentStats.byStatus.length > 0 && (
            <StatusPieChart data={appointmentStats.byStatus} />
          )}
        </div>
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <ActivityLog activities={recentActivities} />
            <div className="mt-4 text-right">
              <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                View all activity &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {appointmentStats.byDayOfWeek.length > 0 && (
          <DayOfWeekChart data={appointmentStats.byDayOfWeek} />
        )}
       {appointmentStats.byMonth && appointmentStats.byMonth.length > 0 && (
  <MonthlyTrendChart data={appointmentStats.byMonth} />
)}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-6">
        <CalendarOverview appointments={appointmentData} />
      </div>
    </div>
  );
};

export default Dashboard;