"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../ui/Container';
import Card from '../ui/Card';
// import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Static dummy data
// const dummyServices = [
//   {
//     id: 1,
//     name: 'Lawn Mowing',
//     description: 'Professional lawn cutting and edging service for a pristine look',
//     image: 'lawn-mowing.jpg',
//     price: 50,
//     duration: 60
//   },
//   {
//     id: 2,
//     name: 'Garden Design',
//     description: 'Custom landscape design and planting services',
//     image: 'garden-design.jpg',
//     price: 200,
//     duration: 120
//   },
//   {
//     id: 3,
//     name: 'Tree Trimming',
//     description: 'Expert tree pruning and maintenance',
//     image: 'tree-trimming.jpg',
//     price: 150,
//     duration: 90
//   },
//   {
//     id: 4,
//     name: 'Irrigation Setup',
//     description: 'Smart watering system installation',
//     image: 'irrigation.jpg',
//     price: 300,
//     duration: 180
//   },
//   {
//     id: 5,
//     name: 'Seasonal Cleanup',
//     description: 'Spring/Fall yard cleanup and preparation',
//     image: 'seasonal-cleanup.jpg',
//     price: 100,
//     duration: 120
//   },
//   {
//     id: 6,
//     name: 'Patio Installation',
//     description: 'Custom stone or paver patio construction',
//     image: 'patio-installation.jpg',
//     price: 2500,
//     duration: 480
//   }
// ];
const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // const handleBookClick = (serviceId) => {
  //   // const token = localStorage.getItem('authToken');

  //   // if (!token) {
  //   //   router.push('/login');
  //   //   return;
  //   // }

  //   // try {
  //   //   const decoded = jwtDecode(token);
  //   //   const role = decoded.role;

  //   //   if (role === 'customer') {
  //   //     // Navigate directly to the date-time selection page with service ID
  //   //     router.push(`/booking`);
  //   //   } else {
  //   //     alert('Access Denied: Only customers can book a service.');
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Token decoding failed", error);
  //   //   router.push('/login');
  //   // }
  // };

  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive range of landscaping and lawn care services to keep your
            outdoor spaces looking beautiful year-round.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {services.slice(0, 6).map((service, index) => (
    <Card key={index} hoverable className="h-full flex flex-col">
      <div className="aspect-[16/9] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <img
            src={service.image.url}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <Card.Content className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        {/* <button
          onClick={() => handleBookClick(service._id)} // Note: use `_id` not `id`
          className="text-green-600 font-medium hover:text-green-700 hover:underline inline-flex items-center"
        >
          Learn More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button> */}
      </Card.Content>
    </Card>
  ))}
</div>





        )}
        {/* ✅ View More Button */}
{services.length > 6 && (
  <div className="text-center mt-8">
    <button
      onClick={() => router.push('/services')}
      className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
    >
      View More Services
    </button>
  </div>
)}
      </Container>
    </section>
  );
};

export default ServicesGrid;


// "use client";

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import Container from '../ui/Container';
// import Card from '../ui/Card';

// const ServicesGrid = () => {
//   const router = useRouter();
  
//   // Static dummy data
//   const dummyServices = [
//     {
//       id: 1,
//       name: 'Lawn Mowing',
//       description: 'Professional lawn cutting and edging service for a pristine look',
//       image: 'https://img.freepik.com/free-photo/gardener-with-weedwacker-cutting-grass-garden_329181-20539.jpg?t=st=1746721892~exp=1746725492~hmac=5cceb6e0efec0861008b518ed446f58fb437f4d4add5d4ab293fdc9c155bdb51&w=1380',
      
//       price: 50,
//       duration: 60
//     },
//     {
//       id: 2,
//       name: 'Garden Design',
//       description: 'Custom landscape design and planting services',
//       image: 'https://img.freepik.com/free-photo/beautiful-green-park_1417-1447.jpg?t=st=1746722067~exp=1746725667~hmac=b00992c0ccc370295d7b212e9b30e96e74e22c79f22ad0dc3f2535b8c2ed597f&w=1380',
//       price: 200,
//       duration: 120
//     },
//     {
//       id: 3,
//       name: 'Tree Trimming',
//       description: 'Expert tree pruning and maintenance',
//       image: 'https://img.freepik.com/free-photo/close-up-gardener-taking-care-plants_23-2148905240.jpg?t=st=1746722124~exp=1746725724~hmac=98671029baa4a8cbe91baa0d64eeee4e0261ffaf43c84d42a9f8e7163b65fe13&w=1380',
//       price: 150,
//       duration: 90
//     },
//     {
//       id: 4,
//       name: 'Irrigation Setup',
//       description: 'Smart watering system installation',
//       image: 'https://img.freepik.com/free-photo/greenhouse-still-life_23-2148127861.jpg?t=st=1746722177~exp=1746725777~hmac=b0378fb4351bd1d94961f82cb31860cef599fad386162d87f5dde76e55a3fa15&w=1380',
//       price: 300,
//       duration: 180
//     },
//     {
//       id: 5,
//       name: 'Seasonal Cleanup',
//       description: 'Spring/Fall yard cleanup and preparation',
//       image: 'https://img.freepik.com/premium-photo/low-section-person-standing-field-autumn_1048944-11624616.jpg?w=1380',
//       price: 100,
//       duration: 120
//     },
//     {
//       id: 6,
//       name: 'Patio Installation',
//       description: 'Custom stone or paver patio construction',
//       image: 'https://img.freepik.com/free-photo/construction-worker-sanding-down-wood-piece_23-2148748861.jpg?t=st=1746722288~exp=1746725888~hmac=fb264c7e75558e94a5d7fd068502f44bac39d3c4d7a5dd8082806932cdc8551b&w=1380',
//       price: 2500,
//       duration: 480
//     }
//   ];

//   const handleBookClick = (serviceId) => {
//     // Your existing booking logic
//   };

//   return (
//     <section className="py-5 bg-white">
//       <Container>
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             We offer a comprehensive range of landscaping and lawn care services to keep your
//             outdoor spaces looking beautiful year-round.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-2">
//           {dummyServices.map((service) => (
//             <Card key={service.id} hoverable className="h-full flex flex-col">
//               <div className="lg:aspect-[16/9] aspect-[3/4] bg-gray-200 relative">
//                 <img
//                   src={`${service.image}`}
//                   alt={service.name}
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//               </div>

//               <Card.Content className="flex-grow">
//                 <h3 className="lg:text-xl text-md font-semibold mb-2">{service.name}</h3>
//                 <p className="text-gray-600 lg:mb-4 mb-0 text-xs">{service.description}</p>
//                 {/* <button
//                   onClick={() => handleBookClick(service.id)}
//                   className="text-green-600 font-medium hover:text-green-700 hover:underline inline-flex items-center"
//                 >
//                   Learn More
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button> */}
//               </Card.Content>
//             </Card>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default ServicesGrid;

