import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardProvider } from '../contexts/DashboardContext';
import LayoutWrapper from '../components/layout/LayoutWrapper'; // client component

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Green Gardens",
  description: "Professional landscaping and lawn care services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </DashboardProvider>
      </body>
    </html>
  );
}
