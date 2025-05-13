// "use client";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import useStore from "../../lib/store";
// import DateTimeSelection from "../../components/booking/DateTimeSelection";

// const BookNowPage = () => {
//   const searchParams = useSearchParams();
//   const serviceId = searchParams.get("serviceId");
//   const { updateCurrentBooking } = useStore();
//   const router = useRouter();

//   useEffect(() => {
//     if (serviceId) {
//       updateCurrentBooking({ serviceId });
//     }
//   }, [serviceId]);

//   const handleNext = () => {
//     router.push("/booking"); // <-- navigate to customer details form
//   };

//   return <DateTimeSelection onNext={handleNext} onBack={() => router.back()} />;
// };

// export default BookNowPage;
// app/booknow/page.js
import dynamic from "next/dynamic";

// Client-only component
const BookNowContent = dynamic(() => import("./BookNowContent"), {
  ssr: false,
});

export default function Page() {
  return <BookNowContent />;
}
