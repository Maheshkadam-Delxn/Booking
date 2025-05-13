// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// const CustomersPage = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await axios.get('http://localhost:5000/api/v1/customers', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setCustomers(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-full">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="text-red-600 text-center">
//           Error loading customers: {error}
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers</h1>
        
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {customers.map((customer) => (
//                   <tr key={customer._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {customer.name}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{customer.email}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{customer.phone}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                         Active
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button className="text-green-600 hover:text-green-900 mr-4">
//                         View
//                       </button>
//                       <button className="text-blue-600 hover:text-blue-900 mr-4">
//                         Edit
//                       </button>
//                       <button className="text-red-600 hover:text-red-900">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default CustomersPage; 



'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Customer from '../../components/customer/Customer';
import { useDashboard } from '@/contexts/DashboardContext';

const AdminPage = () => {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    // Wait until loading is complete before checking role
    if (!isLoading) {
      // Redirect if no user or not a customer
      if (!userData?.token || userData.role !== 'customer') {
        router.push('/login');
      }
    }
  }, [isLoading, userData, router]);

  // While loading context, show a loading message
  if (isLoading) return <p>Loading...</p>;

  // Prevent rendering while redirecting
  if (!userData || userData.role !== 'customer') return null;

  // Render content for 'customer' role
  return (
    <CustomerLayout>
      <Customer />
    </CustomerLayout>
  );
};

export default AdminPage;
