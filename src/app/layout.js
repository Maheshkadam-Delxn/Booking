import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "../contexts/DashboardContext";
import { TenantProvider } from "../contexts/TenantContext";
import LayoutWrapper from "../components/layout/LayoutWrapper"; // client component
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/Footer";
// import GoogleTranslate from "@/components/GoogleTranslate";

// import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gardening 360°",
  description: "Professional landscaping and lawn care services",
};

export default function RootLayout({ children }) {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  //   document.body.appendChild(script);
  //   window.googleTranslateElementInit = () => {
  //     new google.translate.TranslateElement(
  //       {
  //         pageLanguage: "en",
  //         includedLanguages: "en, es",
  //         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
  //       },
  //       "google_translate_element"
  //     );
  //   };
  // }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <GoogleTranslate /> */}
          <TenantProvider>
          <DashboardProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </DashboardProvider>
        </TenantProvider>
        <Toaster position="top-center" />
        {/* <Footer/> */}
        {/* <div id="google_translate_element"></div> */}
      </body>
    </html>
  );
}
