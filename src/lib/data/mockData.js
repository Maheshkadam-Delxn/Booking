// Mock data for the landscaping booking app

// Services offered
export const services = [
  {
    id: 1,
    name: "Lawn Care",
    description: "Regular maintenance including mowing, edging, and fertilization",
    price: 75,
    image: "/images/lawn-care.jpg"
  },
  {
    id: 2,
    name: "Tree Pruning",
    description: "Professional pruning and shaping of trees and shrubs",
    price: 120,
    image: "/images/tree-pruning.jpg"
  },
  {
    id: 3,
    name: "Landscaping Design",
    description: "Custom design and installation of gardens and landscapes",
    price: 200,
    image: "/images/landscaping-design.jpg"
  },
  {
    id: 4,
    name: "Irrigation Installation",
    description: "Installation and repair of sprinkler systems",
    price: 150,
    image: "/images/irrigation.jpg"
  },
  {
    id: 5,
    name: "Hardscaping",
    description: "Installation of walkways, patios, and retaining walls",
    price: 250,
    image: "/images/hardscaping.jpg"
  },
  {
    id: 6,
    name: "Seasonal Cleanup",
    description: "Leaf removal, garden bed cleanup, and debris removal",
    price: 100,
    image: "/images/seasonal-cleanup.jpg"
  }
];

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: "John Smith",
    role: "Homeowner",
    comment: "Green Gardens transformed our backyard into a beautiful oasis. Their attention to detail is amazing!",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Property Manager",
    comment: "We've been using Green Gardens for our commercial properties for 3 years. Always professional and reliable.",
    rating: 5,
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Homeowner",
    comment: "The lawn care service is excellent. My yard has never looked better!",
    rating: 4,
    image: "/images/testimonial-3.jpg"
  }
];

// Mock gallery images
export const galleryImages = [
  {
    id: 1,
    title: "Backyard Transformation",
    type: "before-after",
    before: "/images/before-1.jpg",
    after: "/images/after-1.jpg"
  },
  {
    id: 2,
    title: "Garden Installation",
    type: "before-after",
    before: "/images/before-2.jpg",
    after: "/images/after-2.jpg"
  },
  {
    id: 3,
    title: "Custom Patio",
    type: "completed",
    image: "/images/completed-1.jpg"
  },
  {
    id: 4,
    title: "Irrigation System",
    type: "completed",
    image: "/images/completed-2.jpg"
  }
];

// Mock appointments
export const appointments = [
  {
    id: 1,
    customerName: "James Wilson",
    customerEmail: "james.wilson@example.com",
    customerPhone: "555-123-4567",
    serviceId: 1,
    serviceName: "Lawn Care",
    date: "2023-05-15",
    timeSlot: "09:00 AM - 11:00 AM",
    frequency: "weekly",
    address: "123 Maple St, Springfield, IL",
    notes: "Gate code: 1234. Please knock before entering.",
    status: "completed",
    photos: ["/images/customer-lawn-1.jpg", "/images/customer-lawn-2.jpg"]
  },
  {
    id: 2,
    customerName: "Emily Brown",
    customerEmail: "emily.brown@example.com",
    customerPhone: "555-987-6543",
    serviceId: 3,
    serviceName: "Landscaping Design",
    date: "2023-05-20",
    timeSlot: "01:00 PM - 03:00 PM",
    frequency: "one-time",
    address: "456 Oak Ave, Springfield, IL",
    notes: "Looking for a modern design with low maintenance plants.",
    status: "scheduled",
    photos: ["/images/customer-garden-1.jpg"]
  },
  {
    id: 3,
    customerName: "Robert Davis",
    customerEmail: "robert.davis@example.com",
    customerPhone: "555-456-7890",
    serviceId: 2,
    serviceName: "Tree Pruning",
    date: "2023-05-22",
    timeSlot: "10:00 AM - 12:00 PM",
    frequency: "one-time",
    address: "789 Pine Rd, Springfield, IL",
    notes: "Three large oak trees in backyard need pruning.",
    status: "pending-estimate",
    photos: ["/images/customer-trees-1.jpg", "/images/customer-trees-2.jpg"]
  }
];

// Mock estimates
export const estimates = [
  {
    id: 1,
    appointmentId: 3,
    customerName: "Robert Davis",
    services: [
      { id: 2, name: "Tree Pruning", quantity: 3, unitPrice: 120, total: 360 }
    ],
    additionalFees: [
      { name: "Debris Removal", amount: 50 }
    ],
    subtotal: 360,
    tax: 36,
    total: 446,
    status: "pending",
    createdAt: "2023-05-18",
    expiresAt: "2023-06-01"
  }
]; 