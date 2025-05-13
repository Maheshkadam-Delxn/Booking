// app/booknow/BookNowContent.js
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useStore from "../../lib/store";
import DateTimeSelection from "../../components/booking/DateTimeSelection";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import useStore from "../../lib/store";
// import DateTimeSelection from "../../components/booking/DateTimeSelection";
const BookNowContent = () => {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const { updateCurrentBooking } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (serviceId) {
      updateCurrentBooking({ serviceId });
    }
  }, [serviceId]);

  const handleNext = () => {
    router.push("/booking");
  };

  return <DateTimeSelection onNext={handleNext} onBack={() => router.back()} />;
};

export default BookNowContent;
