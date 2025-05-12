import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AppointmentDetail = ({ appointment }) => {
  // Mock data if no appointment provided
  const mockAppointment = {
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
  };
  
  const appointmentData = appointment || mockAppointment;
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending-estimate':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Pending Estimate</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Scheduled</span>;
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointment #{appointmentData.id}</h2>
          <p className="text-gray-600 text-sm mt-1">{appointmentData.serviceName} - {appointmentData.date}</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          {getStatusBadge(appointmentData.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="mt-1">{appointmentData.customerName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1">{appointmentData.customerEmail}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p className="mt-1">{appointmentData.customerPhone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p className="mt-1">{appointmentData.address}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Service Details</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Service</h4>
                <p className="mt-1">{appointmentData.serviceName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1">{appointmentData.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Time</h4>
                <p className="mt-1">{appointmentData.timeSlot}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
                <p className="mt-1">{appointmentData.frequency}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      {appointmentData.notes && (
        <Card className="mb-8">
          <Card.Header>
            <h3 className="text-lg font-semibold">Notes</h3>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700">{appointmentData.notes}</p>
          </Card.Content>
        </Card>
      )}
      
      {appointmentData.photos && appointmentData.photos.length > 0 && (
        <Card className="mb-8">
          <Card.Header>
            <h3 className="text-lg font-semibold">Property Photos</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {appointmentData.photos.map((photo, index) => (
                <div key={index} className="bg-gray-200 rounded-md aspect-[4/3] flex items-center justify-center">
                  {/* Placeholder for photo - in a real app this would be an image */}
                  <span className="text-gray-500">Photo {index + 1}</span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}
      
      <div className="flex gap-4">
        <Link href="/admin">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
        
        {appointmentData.status === 'pending-estimate' && (
          <Link href={`/admin/create-estimate?appointment=${appointmentData.id}`}>
            <Button>
              Create Estimate
            </Button>
          </Link>
        )}
        
        {appointmentData.status === 'scheduled' && (
          <Button>
            Mark as Completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail; 