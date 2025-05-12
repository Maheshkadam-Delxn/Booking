"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useStore from "../../lib/store";
import { useRouter } from "next/navigation";

const BookingReview = ({ onBack }) => {
  const router = useRouter();
  const { currentBooking, services, createAppointment, resetCurrentBooking } =
    useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the selected service
  const selectedService =
    services.find((service) => service.id === currentBooking.serviceId) || {};

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      // Create the appointment in our store
      createAppointment({
        ...currentBooking,
        serviceName: selectedService.name,
        status: "pending-estimate",
      });

      // Reset current booking data
      resetCurrentBooking();

      // Redirect to confirmation page
      // In a real app this would redirect to a confirmation page with the booking ID
      router.push("/booking/confirmation");

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>

      <Card className="mb-8">
        <Card.Header>
          <h3 className="text-xl font-semibold">Booking Summary</h3>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Service Details
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium">Service:</span>{" "}
                  {selectedService.service}
                </li>
                <li>
                  <span className="font-medium">Date:</span>{" "}
                  {currentBooking.date}
                </li>
                <li>
                  <span className="font-medium">Time:</span>{" "}
                  {currentBooking.timeSlot}
                </li>
                <li>
                  <span className="font-medium">Frequency:</span>{" "}
                  {currentBooking.frequency}
                </li>
                <li>
                  <span className="font-medium">Estimated Price:</span> $
                  {selectedService.price}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Contact Information
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium">Name:</span>{" "}
                  {currentBooking.customerName}
                </li>
                <li>
                  <span className="font-medium">Email:</span>{" "}
                  {currentBooking.customerEmail}
                </li>
                <li>
                  <span className="font-medium">Phone:</span>{" "}
                  {currentBooking.customerPhone}
                </li>
                <li>
                  <span className="font-medium">Address:</span>{" "}
                  {currentBooking.address?.street},{" "}
                  {currentBooking.address?.city},{" "}
                  {currentBooking.address?.state}{" "}
                  {currentBooking.address?.zipCode},{" "}
                  {currentBooking.address?.country}
                </li>
              </ul>
            </div>
          </div>

          {currentBooking.notes && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Special Instructions
              </h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">
                {currentBooking.notes}
              </p>
            </div>
          )}
        </Card.Content>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <p className="text-green-800">
          <span className="font-medium">What happens next?</span> After you
          submit your booking, our team will review your request and prepare a
          detailed estimate. We'll contact you within 24-48 hours to confirm the
          appointment and provide pricing details.
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Details
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
        >
          {isSubmitting ? "Submitting..." : "Submit Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingReview;
