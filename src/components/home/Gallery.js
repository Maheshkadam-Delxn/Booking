// import React from 'react';
// import Container from '../ui/Container';

// const Gallery = () => {
//   return (
//     <section className="py-16 bg-white">
//       <Container>
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Work</h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Browse through our gallery of recent landscaping projects to see the
//             transformations we've created for our clients.
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Using local images from the public folder */}
//           <div key="1" className="overflow-hidden rounded-lg shadow-md">
//             {/* Before-After comparison */}
//             <div className="relative">
//               <div className="aspect-[4/3] grid grid-cols-2 gap-2">
//                 <div className="bg-gray-200 p-2 flex items-center justify-center">
//                   <img 
//                     src="/images/service2.jpg" // Image from public/images folder
//                     alt="Before"
//                     className="object-cover w-full h-full rounded"
//                     width="100%" 
//                     height="auto"
//                   />
//                 </div>
//                 <div className="bg-gray-300 p-2 flex items-center justify-center">
//                   <img 
//                     src="/images/service2.jpg" // Image from public/images folder
//                     alt="After"
//                     className="object-cover w-full h-full rounded"
//                     width="100%" 
//                     height="auto"
//                   />
//                 </div>
//               </div>
//               <div className="p-4 bg-white">
//                 <h3 className="font-medium">Project 1</h3>
//               </div>
//             </div>

            
            
//           </div>


//           <div key="1" className="overflow-hidden rounded-lg shadow-md">
//             {/* Before-After comparison */}
//             <div className="relative">
//               <div className="aspect-[4/3] grid grid-cols-2 gap-2">
//                 <div className="bg-gray-200 p-2 flex items-center justify-center">
//                   <img 
//                     src="/images/service2.jpg" // Image from public/images folder
//                     alt="Before"
//                     className="object-cover w-full h-full rounded"
//                     width="100%" 
//                     height="auto"
//                   />
//                 </div>
//                 <div className="bg-gray-300 p-2 flex items-center justify-center">
//                   <img 
//                     src="/images/service2.jpg" // Image from public/images folder
//                     alt="After"
//                     className="object-cover w-full h-full rounded"
//                     width="100%" 
//                     height="auto"
//                   />
//                 </div>
//               </div>
//               <div className="p-4 bg-white">
//                 <h3 className="font-medium">Project 1</h3>
//               </div>
//             </div>

            
            
//           </div>



//           {/* Single image */}
//           <div key="2" className="overflow-hidden rounded-lg shadow-md">
//             <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
//               <img 
//                 src="/images/service2.jpg" // Image from public/images folder
//                 alt="Project 2"
//                 className="object-cover w-full h-full rounded"
//               />
//             </div>
//             <div className="p-4 bg-white">
//               <h3 className="font-medium">Project 2</h3>
//             </div>
//           </div>



//           <div key="2" className="overflow-hidden rounded-lg shadow-md">
//             <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
//               <img 
//                 src="/images/service2.jpg" // Image from public/images folder
//                 alt="Project 2"
//                 className="object-cover w-full h-full rounded"
//               />
//             </div>
//             <div className="p-4 bg-white">
//               <h3 className="font-medium">Project 2</h3>
//             </div>
//           </div>


//         </div>



        
        
//         <div className="mt-10 text-center">
//           <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50">
//             View All Projects
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default Gallery;





'use client';

import React from 'react';
import Container from '../ui/Container';
import Link from 'next/link';



const Gallery = () => {
  // Project data array
  const projects = [
    {
      id: 1,
      title: "Modern Garden Renovation",
      category: "Garden Design",
      image: "/images/garden-renovation.png",
    },
    {
      id: 2,
      title: "Commercial Plaza Landscaping",
      category: "Commercial",
      image: "/images/commercial-plaza.png",
    },
    {
      id: 3,
      title: "Residential Backyard Transformation",
      category: "Residential",
      image: "/images/backyard-transformation.png",
    },
    {
      id: 4,
      title: "Water Feature Installation",
      category: "Water Features",
      image: "/images/water-feature.png",
    },
    {
      id: 5,
      title: "Sustainable Garden Design",
      category: "Eco-Friendly",
      image: "/images/sustainable-garden.png",
    },
    {
      id: 6,
      title: "Patio & Hardscape Design",
      category: "Hardscaping",
      image: "/images/patio-hardscape.png",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Project Gallery</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our portfolio of completed landscaping projects and get inspired for
            your own outdoor transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
                    {/* <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
                      View Project
                    </button> */}
<Link href={`/portfolio/modern-backyard-retreat`}>
  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
    View Project
  </button>
</Link>



                  </div>
                </div>
              </div>
              <div className="p-4">
                <span className="text-sm text-green-600 font-medium">{project.category}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-1">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
        <Link href="/gallery">
  <span className="inline-block bg-white border border-green-600 text-green-600 px-6 py-3 rounded-md font-medium hover:bg-green-600 hover:text-white transition-colors duration-300">
    View All Projects
  </span>
</Link>
</div>

      </Container>
    </section>
  );
};

export default Gallery;
