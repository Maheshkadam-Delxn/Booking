// "use client"
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
// import Container from '../../components/ui/Container';
// import PageHeader from '../../components/layout/PageHeader';

// // Define your API URL - replace with your actual API URL in your environment variables
// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

// export default function ServicesPage() {
//   const [services, setServices] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Define fetchServices outside useEffect so it can be reused
//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/services`);

      
//       if (!response.ok) throw new Error('Failed to fetch services');

//       const data = await response.json();
//       console.log('Response Data:', data); // Log the response data here
//       if (Array.isArray(data.data)) {
//         setServices(data.data);
//       } else {
//         setServices([]);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // We'll still have hardcoded plans for now, assuming they're not from the API
//   useEffect(() => {
//     setPlans([
//       {
//         id: 'basic',
//         title: 'Basic Care',
//         price: '$150/month',
//         frequency: 'Monthly Service',
//         features: [
//           'Lawn mowing and edging',
//           'Blowing and cleanup',
//           'Basic weed control',
//           'Seasonal fertilization'
//         ]
//       },
//       {
//         id: 'premium',
//         title: 'Premium Care',
//         price: '$250/month',
//         frequency: 'Bi-weekly Service',
//         features: [
//           'All Basic Care services',
//           'Deep pruning',
//           'Bed weed control',
//           'Regular fertilizer',
//           'Plant health monitoring'
//         ]
//       },
//       {
//         id: 'ultimate',
//         title: 'Ultimate Care',
//         price: '$350/month',
//         frequency: 'Weekly Service',
//         features: [
//           'All Premium Care services',
//           'Tree trimming (up to 8ft)',
//           'Seasonal flower rotation',
//           'Irrigation system checks',
//           'Priority scheduling',
//           'Monthly service reports'
//         ]
//       }
//     ]);
//   }, []);

//   const renderLoading = () => (
//     <div className="flex flex-col items-center justify-center py-20">
//       <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
//       <p className="text-gray-600 font-medium">Loading services...</p>
//     </div>
//   );

//   const renderError = () => (
//     <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
//       <div className="flex items-center mb-4">
//         <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
//         <h3 className="text-lg font-medium text-red-800">Unable to load services</h3>
//       </div>
//       <p className="text-red-700 mb-4">{error}</p>
//       <button 
//         onClick={() => {
//           setLoading(true);
//           setError(null);
//           fetchServices();
//         }}
//         className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
//       >
//         Try Again
//       </button>
//     </div>
//   );

//   const renderServices = () => (
//     <>
//       {services.map((service, index) => (
//         <div 
//           key={service.id} 
//           className="mb-16 overflow-hidden group"
//         >
//           <div className="flex flex-col md:flex-row items-stretch bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
//             <div className={`w-full md:w-2/5 lg:w-1/3 relative ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
//               <img 
//                 src={service.image || '/api/placeholder/800/600'} 
//                 alt={service.title} 
//                 className="w-full h-full object-cover object-center min-h-64"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
//                 <Link href={`/services/${service._id}`} passHref>
//                   <span className="inline-flex items-center bg-white/90 hover:bg-white text-green-800 font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors">
//                     View Details
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                   </span>
//                 </Link>
//               </div>
//             </div>
//             <div className={`w-full md:w-3/5 lg:w-2/3 p-6 md:p-8 flex flex-col ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
//               <div className="flex items-center mb-4">
//                 <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-3xl mr-3">
//                   {service.icon}
//                 </span>
//                 <h2 className="text-2xl md:text-3xl font-bold text-green-800">{service.title}</h2>
//               </div>
              
//               <p className="text-gray-700 text-lg mb-6 flex-grow">{service.description}</p>
              
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {service.highlights && service.highlights.map((item, i) => (
//                     <div key={i} className="flex items-start">
//                       <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                       <span className="text-gray-700">{item}</span>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="flex flex-wrap gap-4 pt-4">
//                   <Link href="/contact">
//                     <span className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
//                       Get a Quote
//                     </span>
//                   </Link>
//                   <Link href="/schedule">
//                     <span className="inline-flex items-center bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-6 rounded-lg transition-colors">
//                       Schedule Service
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );

//   const renderPlans = () => (
//     <div className="mt-24 mb-20">
//       <div className="text-center mb-16">
//         <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Maintenance Plans</h2>
//         <p className="text-gray-600 text-lg max-w-3xl mx-auto">
//           Choose the perfect maintenance plan for your property. All plans can be customized 
//           to meet your specific needs.
//         </p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {plans.map((plan, index) => (
//           <div 
//             key={plan.id} 
//             className={`relative border-2 rounded-xl p-6 md:p-8 transition-all hover:shadow-xl ${
//               index === 1 ? 'border-green-500 shadow-lg' : 'border-gray-200'
//             }`}
//           >
//             {index === 1 && (
//               <div className="absolute -top-4 inset-x-0 flex justify-center">
//                 <span className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
//                   MOST POPULAR
//                 </span>
//               </div>
//             )}
            
//             <div className="mb-6">
//               <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
//                 index === 1 ? 'bg-green-100' : 'bg-gray-100'
//               }`}>
//                 <CheckCircle className={`h-6 w-6 ${
//                   index === 1 ? 'text-green-600' : 'text-gray-600'
//                 }`} />
//               </div>
//               <h3 className={`text-xl font-bold mb-1 ${
//                 index === 1 ? 'text-green-700' : 'text-gray-800'
//               }`}>
//                 {plan.title}
//               </h3>
//               <div className="flex items-baseline gap-1">
//                 <span className={`text-2xl font-bold ${
//                   index === 1 ? 'text-green-600' : 'text-gray-900'
//                 }`}>
//                   {plan.price.split('/')[0]}
//                 </span>
//                 <span className="text-gray-500 font-medium">
//                   /month
//                 </span>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">{plan.frequency}</p>
//             </div>
            
//             <ul className="space-y-3 mb-8">
//               {plan.features.map((feature, i) => (
//                 <li key={i} className="flex items-start">
//                   <CheckCircle className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
//                     index === 1 ? 'text-green-500' : 'text-gray-500'
//                   }`} />
//                   <span className="text-gray-700">{feature}</span>
//                 </li>
//               ))}
//             </ul>
            
//             <Link href="/contact" className="block">
//               <span className={`block w-full text-center font-medium py-3 px-6 rounded-lg transition-colors ${
//                 index === 1 
//                   ? 'bg-green-600 hover:bg-green-700 text-white' 
//                   : 'bg-white border-2 border-gray-300 hover:border-green-600 hover:text-green-700'
//               }`}>
//                 Choose Plan
//               </span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <PageHeader 
//         title="Professional Landscaping Services"
//         description="Creating and maintaining beautiful outdoor spaces for your home or business"
//         backgroundImage="/images/services-header.jpg"
//       />
      
//       <Container className="py-12 md:py-20">
//         {loading ? renderLoading() : error ? renderError() : renderServices()}
        
//         {!loading && !error && renderPlans()}
        
//         <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-8 md:p-12 text-center mt-12">
//           <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Outdoor Space?</h2>
//           <p className="mb-8 max-w-2xl mx-auto text-green-50 text-lg">
//             Contact us today for a free consultation and estimate. Our experts are ready to help you 
//             create and maintain the landscape of your dreams.
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link href="/contact">
//               <span className="inline-flex items-center bg-white text-green-800 hover:bg-green-50 font-medium py-3 px-8 rounded-lg transition-colors">
//                 Get Started
//                 <ChevronRight className="h-5 w-5 ml-1" />
//               </span>
//             </Link>
//             <Link href="/gallery">
//               <span className="inline-flex items-center bg-green-600 text-white hover:bg-green-500 font-medium py-3 px-8 rounded-lg transition-colors">
//                 View Our Gallery
//               </span>
//             </Link>
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// }



"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

const dummyServices = [
  {
    id: 1,
    name: 'Lawn Mowing',
    description: 'Professional lawn cutting and edging service for a pristine look',
    image: 'https://img.freepik.com/free-photo/gardener-with-weedwacker-cutting-grass-garden_329181-20539.jpg',
    price: 50,
    duration: 60,
    highlights: ['Precision cutting', 'Edging included', 'Debris cleanup']
  },
  {
    id: 2,
    name: 'Garden Design',
    description: 'Custom landscape design and planting services',
    image: 'https://img.freepik.com/free-photo/beautiful-green-park_1417-1447.jpg',
    price: 200,
    duration: 120,
    highlights: ['Custom designs', 'Plant selection', '3D visualization']
  },
  {
    id: 3,
    name: 'Tree Trimming',
    description: 'Expert tree pruning and maintenance',
    image: 'https://img.freepik.com/free-photo/close-up-gardener-taking-care-plants_23-2148905240.jpg',
    price: 150,
    duration: 90,
    highlights: ['Safety pruning', 'Disease control', 'Waste removal']
  },
  {
    id: 4,
    name: 'Irrigation Setup',
    description: 'Smart watering system installation',
    image: 'https://img.freepik.com/free-photo/greenhouse-still-life_23-2148127861.jpg',
    price: 300,
    duration: 180,
    highlights: ['Smart controllers', 'Zone setup', 'Maintenance alerts']
  },
  {
    id: 5,
    name: 'Seasonal Cleanup',
    description: 'Spring/Fall yard cleanup and preparation',
    image: 'https://img.freepik.com/premium-photo/low-section-person-standing-field-autumn_1048944-11624616.jpg',
    price: 100,
    duration: 120,
    highlights: ['Leaf removal', 'Mulching', 'Gutter cleaning']
  },
  {
    id: 6,
    name: 'Paver block landscaping',
    description: 'Custom stone or paver patio construction',
    image: 'https://img.freepik.com/free-photo/construction-worker-sanding-down-wood-piece_23-2148748861.jpg',
    price: 2500,
    duration: 480,
    highlights: ['Custom designs', 'Premium materials', 'Drainage solutions']
  }
];

export default function ServicesPage() {
  const [services] = useState(dummyServices);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setPlans([
        {
          id: 'basic',
          title: 'Basic Care',
          price: '$150/month',
          frequency: 'Monthly Service',
          features: [
            'Lawn mowing and edging',
            'Blowing and cleanup',
            'Basic weed control',
            'Seasonal fertilization'
          ]
        },
        {
          id: 'premium',
          title: 'Premium Care',
          price: '$250/month',
          frequency: 'Bi-weekly Service',
          features: [
            'All Basic Care services',
            'Deep pruning',
            'Bed weed control',
            'Regular fertilizer',
            'Plant health monitoring'
          ]
        },
        {
          id: 'ultimate',
          title: 'Ultimate Care',
          price: '$350/month',
          frequency: 'Weekly Service',
          features: [
            'All Premium Care services',
            'Tree trimming (up to 8ft)',
            'Seasonal flower rotation',
            'Irrigation system checks',
            'Priority scheduling',
            'Monthly service reports'
          ]
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading services...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        <h3 className="text-lg font-medium text-red-800">Unable to load services</h3>
      </div>
      <p className="text-red-700 mb-4">{error}</p>
      <button 
        onClick={() => {
          setLoading(true);
          setError(null);
        }}
        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderServices = () => (
    <>
      {services.map((service) => (
        <div key={service.id} className="mb-16 overflow-hidden group">
          <div className="flex flex-col md:flex-row items-stretch bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
            <div className="w-full md:w-2/5 lg:w-1/3 relative">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover object-center min-h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                {/* <Link href={`/services/${service.id}`} passHref>
                  <span className="inline-flex items-center bg-white/90 hover:bg-white text-green-800 font-medium py-2 px-4 rounded-full backdrop-blur-sm transition-colors">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </Link> */}
              </div>
            </div>
            <div className="w-full md:w-3/5 lg:w-2/3 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">{service.name}</h2>
              <p className="text-gray-700 text-lg mb-6 flex-grow">{service.description}</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.highlights.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/contact">
                    <span className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Get a Quote
                    </span>
                  </Link>
                  {/* <Link href="/schedule">
                    <span className="inline-flex items-center bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Schedule Service
                    </span>
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // const renderPlans = () => (
  //   <div className="mt-16">
  //     <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8">Service Plans</h2>
  //     <div className="grid gap-6 md:grid-cols-3">
  //       {plans.map((plan) => (
  //         <div key={plan.id} className="bg-white shadow-lg rounded-xl p-6 text-center">
  //           <h3 className="text-xl font-semibold text-green-700 mb-2">{plan.title}</h3>
  //           <p className="text-green-800 text-lg font-bold mb-1">{plan.price}</p>
  //           <p className="text-gray-600 mb-4">{plan.frequency}</p>
  //           <ul className="text-left space-y-2">
  //             {plan.features.map((feature, idx) => (
  //               <li key={idx} className="flex items-start">
  //                 <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
  //                 <span>{feature}</span>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
    <>
      <PageHeader 
        title="Professional Landscaping Services"
        description="Creating and maintaining beautiful outdoor spaces for your home or business"
        backgroundImage="/images/services-header.jpg"
      />
      
      <Container className="py-12 md:py-20">
        {loading ? renderLoading() : error ? renderError() : renderServices()}
        {!loading && !error
        //  && renderPlans()
         }
        <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-8 md:p-12 text-center mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Outdoor Space?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-green-50 text-lg">
            Contact us today for a free consultation and estimate. Our experts are ready to help you 
            create and maintain the landscape of your dreams.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center bg-white text-green-800 hover:bg-green-50 font-medium py-2.5 px-6 rounded-lg transition-colors">
              Contact Us
            </span>
          </Link>
        </div>
      </Container>
    </>
  );
}
