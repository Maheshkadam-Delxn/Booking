// 'use client';

// import { usePathname } from 'next/navigation';
// import Header from './Header';
// import Footer from './Footer';

// export default function LayoutWrapper({ children }) {
//   const pathname = usePathname();
//   const noHeaderPaths = ['/customers', '/customers/services','/customers/appointments', '/customers/settings'];
//   const showHeader = !noHeaderPaths.includes(pathname);

//   return (
//     <>
//       {showHeader && <Header />}
//       {children}
//       <Footer />
//     </>
//   );
// }







'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const noHeaderPaths = [
    '/customers',
    '/customers/services',
    '/customers/appointments',
    '/customers/settings',
  ];

  // Check if the pathname starts with '/customers/services' (dynamic path handling)
  const showHeader = !noHeaderPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {showHeader && <Header />}
      {children}
      <Footer />
    </>
  );
}

