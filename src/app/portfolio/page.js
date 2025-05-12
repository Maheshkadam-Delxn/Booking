import React from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function PortfolioPage() {
  const projects = [
    {
      id: 'modern-backyard-retreat',
      title: 'Modern Backyard Retreat',
      category: 'Residential',
      description: 'A complete backyard transformation featuring a modern pool, outdoor kitchen, and fire pit area.',
      image: '/images/portfolio/modern-backyard.jpg',
      location: 'Westlake Hills',
      completionDate: 'Spring 2023'
    },
    {
      id: 'commercial-plaza-landscaping',
      title: 'Commercial Plaza Landscaping',
      category: 'Commercial',
      description: 'Drought-resistant landscaping for a large commercial plaza with integrated seating areas.',
      image: '/images/portfolio/commercial-plaza.jpg',
      location: 'Downtown Business District',
      completionDate: 'Summer 2022'
    },
    {
      id: 'mediterranean-garden',
      title: 'Mediterranean Garden Estate',
      category: 'Residential',
      description: 'A Mediterranean-inspired garden with fountain features, olive trees, and lavender fields.',
      image: '/images/portfolio/mediterranean-garden.jpg',
      location: 'Lakeside Estates',
      completionDate: 'Fall 2022'
    },
    {
      id: 'native-plant-restoration',
      title: 'Native Plant Restoration',
      category: 'Environmental',
      description: 'A large-scale restoration project featuring local native plants and pollinator habitats.',
      image: '/images/portfolio/native-restoration.jpg',
      location: 'River Valley Preserve',
      completionDate: 'Spring 2022'
    },
    {
      id: 'rooftop-garden',
      title: 'Corporate Rooftop Garden',
      category: 'Commercial',
      description: 'A sustainable rooftop garden providing relaxation space for employees with urban views.',
      image: '/images/portfolio/rooftop-garden.jpg',
      location: 'Tech Center Tower',
      completionDate: 'Summer 2023'
    },
    {
      id: 'japanese-inspired-landscape',
      title: 'Japanese-Inspired Landscape',
      category: 'Residential',
      description: 'A tranquil landscape featuring a koi pond, bamboo groves, and meditation garden.',
      image: '/images/portfolio/japanese-garden.jpg',
      location: 'Hillside Estates',
      completionDate: 'Fall 2023'
    },
    {
      id: 'community-park-renovation',
      title: 'Community Park Renovation',
      category: 'Municipal',
      description: 'Complete renovation of a community park with playgrounds, walking trails, and native plantings.',
      image: '/images/portfolio/community-park.jpg',
      location: 'Oakwood Community',
      completionDate: 'Spring 2021'
    },
    {
      id: 'drought-tolerant-frontyard',
      title: 'Drought-Tolerant Front Yard',
      category: 'Residential',
      description: 'A water-wise front yard transformation featuring succulents, gravel pathways, and boulder accents.',
      image: '/images/portfolio/drought-tolerant.jpg',
      location: 'Sunset Neighborhood',
      completionDate: 'Summer 2021'
    },
    {
      id: 'luxury-pool-landscape',
      title: 'Luxury Pool & Landscape',
      category: 'Residential',
      description: 'An elegant pool area with waterfall features, outdoor living space, and dramatic lighting.',
      image: '/images/portfolio/luxury-pool.jpg',
      location: 'Highland Estates',
      completionDate: 'Summer 2023'
    }
  ];
  
  const categories = ['All', 'Residential', 'Commercial', 'Municipal', 'Environmental'];

  return (
    <>
      <PageHeader 
        title="Our Portfolio"
        description="Explore our completed landscaping projects across residential and commercial properties"
        backgroundImage="/images/portfolio-header.jpg"
      />
      
      <Container className="py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-full border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.id}`}>
              <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{project.location}</span>
                    <span>{project.completionDate}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
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
      </Container>
    </>
  );
} 