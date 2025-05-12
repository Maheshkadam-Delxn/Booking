'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function PortfolioPage() {
  const projects = [
    {
      id: 'modern-backyard-retreat',
      title: 'Modern Backyard Retreat',
      category: 'Residential',
      categoryId: 'residential',
      description: 'A complete backyard transformation featuring a modern pool, outdoor kitchen, and fire pit area.',
      beforeImage: '/images/modern-backyard.png',
      afterImage: 'https://img.freepik.com/free-photo/analog-city-landscape-with-buildings-daylight_23-2149661428.jpg?t=st=1746720726~exp=1746724326~hmac=40f674fabd0357f32dc4d2aaefe2b574587336b3de96b309ad7bf22585fe8198&w=1380',
      location: 'Westlake Hills',
      completionDate: 'Spring 2023'
    },
    {
      id: 'commercial-plaza-landscaping',
      title: 'Commercial Plaza Landscaping',
      category: 'Commercial',
      categoryId: 'commercial',
      description: 'Drought-resistant landscaping for a large commercial plaza with integrated seating areas.',
      beforeImage: 'https://img.freepik.com/free-photo/covered-lifestyle-garden-with-indoor-outdoor-living_1127-3426.jpg?t=st=1746720822~exp=1746724422~hmac=9dd4f0975da8333f5b6703124c6b69659e311207d36de110cb48013d7cd09926&w=1380',
      afterImage: 'https://img.freepik.com/free-photo/covered-lifestyle-garden-with-indoor-outdoor-living_1127-3424.jpg?t=st=1746720866~exp=1746724466~hmac=4f08d988c8ed308dff35ec2878b07b79502c00baa588b41e770fbf57d912699e&w=1380',
      location: 'Downtown Business District',
      completionDate: 'Summer 2022'
    },
    {
      id: 'mediterranean-garden',
      title: 'Mediterranean Garden Estate',
      category: 'Residential',
      categoryId: 'residential',
      description: 'A Mediterranean-inspired garden with fountain features, olive trees, and lavender fields.',
      beforeImage: 'https://img.freepik.com/free-photo/street-texture-retro-tuscany-city_1203-5049.jpg?t=st=1746720932~exp=1746724532~hmac=e645ea5ce2637fd832a53e73423b69b2746bb88f224747edbe1ae9a1c93a1df3&w=1380',
      afterImage: 'https://img.freepik.com/free-photo/desvalls-palace-labyrinth-park-barcelona_1398-2206.jpg?t=st=1746720959~exp=1746724559~hmac=801cee8046fa596d85ac33a0f435769cbb6f67f6a8008c0cfc3db26aeadd372c&w=1380',
      location: 'Lakeside Estates',
      completionDate: 'Fall 2022'
    },
    {
      id: 'native-plant-restoration',
      title: 'Native Plant Restoration',
      category: 'Environmental',
      categoryId: 'environmental',
      description: 'A large-scale restoration project featuring local native plants and pollinator habitats.',
      beforeImage: 'https://img.freepik.com/free-photo/plants_23-2148013478.jpg?t=st=1746721089~exp=1746724689~hmac=f452d08d9e17f68e54ba5cfc36d69edef8a24f4150ff05ef39dbcd5c97900a2d&w=1380',
      afterImage: 'https://img.freepik.com/free-photo/reforestation-done-by-voluntary-group_23-2149500827.jpg?t=st=1746721155~exp=1746724755~hmac=499786d5923a0bbd3b08f77fec7e94f7ef2bdfbf2a87440fa5e557f113d0c9fd&w=1380',
      location: 'River Valley Preserve',
      completionDate: 'Spring 2022'
    },
    {
      id: 'rooftop-garden',
      title: 'Corporate Rooftop Garden',
      category: 'Commercial',
      categoryId: 'commercial',
      description: 'A sustainable rooftop garden providing relaxation space for employees with urban views.',
      beforeImage: 'https://img.freepik.com/free-photo/covered-lifestyle-garden-with-indoor-outdoor-living_1127-3425.jpg?t=st=1746721205~exp=1746724805~hmac=2575993a5ecfab7ea7d6b5286fe9e1dd3d04d539eb805edb283d8e8c22f8dcad&w=1380',
      afterImage: 'https://img.freepik.com/free-photo/hotel-lobby-interior_1127-3423.jpg?t=st=1746721233~exp=1746724833~hmac=598bcf84ef5f2f1685279c3bf22e8c060bc2d91dc88c0a67b78256c8ad3e7b6e&w=1380',
      location: 'Tech Center Tower',
      completionDate: 'Summer 2023'
    },
    {
      id: 'japanese-inspired-landscape',
      title: 'Japanese-Inspired Landscape',
      category: 'Residential',
      categoryId: 'residential',
      description: 'A tranquil landscape featuring a koi pond, bamboo groves, and meditation garden.',
      beforeImage: 'https://img.freepik.com/free-photo/breathtaking-view-moss-covered-rocks-trees-captured-beautiful-japanese-garden_181624-43405.jpg?t=st=1746721321~exp=1746724921~hmac=7c0889e8726b4fd628e0277051f2474a1d1379462e0433465641093277d1cad9&w=1380',
      afterImage: 'https://img.freepik.com/premium-photo/stone-garden_276479-305.jpg?w=1380',
      location: 'Hillside Estates',
      completionDate: 'Fall 2023'
    },
    // {
    //   id: 'community-park-renovation',
    //   title: 'Community Park Renovation',
    //   category: 'Municipal',
    //   categoryId: 'municipal',
    //   description: 'Complete renovation of a community park with playgrounds, walking trails, and native plantings.',
    //   beforeImage: '/images/portfolio/community-park-before.jpg',
    //   afterImage: '/images/portfolio/community-park.jpg',
    //   location: 'Oakwood Community',
    //   completionDate: 'Spring 2021'
    // },
    // {
    //   id: 'drought-tolerant-frontyard',
    //   title: 'Drought-Tolerant Front Yard',
    //   category: 'Residential',
    //   categoryId: 'residential',
    //   description: 'A water-wise front yard transformation featuring succulents, gravel pathways, and boulder accents.',
    //   beforeImage: '/images/portfolio/drought-tolerant-before.jpg',
    //   afterImage: '/images/portfolio/drought-tolerant.jpg',
    //   location: 'Sunset Neighborhood',
    //   completionDate: 'Summer 2021'
    // },
    // {
    //   id: 'luxury-pool-landscape',
    //   title: 'Luxury Pool & Landscape',
    //   category: 'Residential',
    //   categoryId: 'residential',
    //   description: 'An elegant pool area with waterfall features, outdoor living space, and dramatic lighting.',
    //   beforeImage: '/images/portfolio/luxury-pool-before.jpg',
    //   afterImage: '/images/portfolio/luxury-pool.jpg',
    //   location: 'Highland Estates',
    //   completionDate: 'Summer 2023'
    // }
  ];
  
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'municipal', name: 'Municipal' },
    { id: 'environmental', name: 'Environmental' },
    { id: 'lawn', name: 'Lawn Care' },
    { id: 'palm', name: 'Palm Tree Work' },
    { id: 'pavers', name: 'Paver Installations' },
    { id: 'synthetic', name: 'Synthetic Grass' }
  ];

  // State for active filter
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter projects based on active category
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.categoryId === activeFilter);

  return (
    <>
       <PageHeader
      title="Transform Your Outdoor Space"
      description="Explore our landscaping services designed to elevate your yard."
      backgroundImage="/images/bgGrass.png"
    />
       {/* Category Filter */}
       <div className="flex flex-wrap justify-center gap-4 mb-12 overflow-x-auto px-2 mt-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                activeFilter === category.id
                  ? 'bg-green-800 text-white'
                  : 'border-gray-100 border-x-2 border-y-2 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      <Container className="py-12">
       
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.id}`}>
              <div className="bg-white rounded-lg overflow-hidden  hover:shadow-xl transition-shadow">
                <div className="relative h-64 w-full">
                  {/* Before/After side by side comparison */}
                  <div className="flex h-full">
                    <div className="relative w-1/2 h-full">
                      <Image 
                        src={project.beforeImage} 
                        alt={`${project.title} Before`}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-white bg-opacity-85 text-gray-800 text-xs font-medium px-3 py-1 rounded-md">
                        Before
                      </div>
                    </div>
                    <div className="relative w-1/2 h-full">
                      <Image 
                        src={project.afterImage} 
                        alt={`${project.title} After`}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-white bg-opacity-85 text-gray-800 text-xs font-medium px-3 py-1 rounded-md">
                        After
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
       
      </Container>
       {/* Call to Action */}
       <div className="mt-16 bg-gray-50 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Ready for Your Own Landscape Transformation?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            Our team of expert designers and landscapers can bring your dream outdoor space to life.
            Contact us today to discuss your project ideas and goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Request a Consultation
              </span>
            </Link>
            <Link href="/services">
              <span className="inline-block bg-white hover:bg-gray-100 text-green-700 border border-green-600 font-semibold py-3 px-6 rounded-lg transition-colors">
                Explore Our Services
              </span>
            </Link>
          </div>
        </div>
    </>
  );
}