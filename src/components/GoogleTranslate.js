// "use client";

// import { useEffect } from "react";

// export default function GoogleTranslate() {
//   useEffect(() => {
//     if (!window.googleTranslateElementInit) {
//       window.googleTranslateElementInit = () => {
//         if (window.google && window.google.translate) {
//           const alreadyHasCombo = document.querySelector(
//             "#google_translate_element .goog-te-combo"
//           );
//           if (alreadyHasCombo) return;

//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: "en",
//               includedLanguages: "en,es,hi",
//               autoDisplay: false, // disables popup auto
//             },
//             "google_translate_element"
//           );
//         }
//       };
//     }

//     const scriptId = "google-translate-script";
//     if (!document.getElementById(scriptId)) {
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src =
//         "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);
//     } else if (window.google && window.google.translate) {
//       window.googleTranslateElementInit();
//     }
//   }, []);

//   return <div id="google_translate_element"></div>;
// }



// "use client";

// import { useEffect } from "react";

// export default function GoogleTranslate() {
//   useEffect(() => {
//     // Add CSS to hide Google Translate elements
//     const style = document.createElement('style');
//     style.textContent = `
//       .goog-te-banner-frame {
//         display: none !important;
//         visibility: hidden !important;
//         height: 0 !important;
//       }
      
//       .goog-te-menu-frame {
//         z-index: 1000 !important;
//       }
      
//       body {
//         top: 0 !important;
//       }
      
//       .goog-tooltip {
//         display: none !important;
//       }
      
//       .goog-tooltip:hover {
//         display: none !important;
//       }
      
//       .goog-text-highlight {
//         background-color: transparent !important;
//         border: none !important;
//         box-shadow: none !important;
//       }
      
//       #google_translate_element {
//         display: none;
//       }
//     `;
//     document.head.appendChild(style);

//     if (!window.googleTranslateElementInit) {
//       window.googleTranslateElementInit = () => {
//         if (window.google && window.google.translate) {
//           const alreadyHasCombo = document.querySelector(
//             "#google_translate_element .goog-te-combo"
//           );
//           if (alreadyHasCombo) return;

//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: "en",
//               includedLanguages: "en,es,hi",
//               autoDisplay: false,
//               layout: window.google.translate.TranslateElement.InlineLayout.HIDE
//             },
//             "google_translate_element"
//           );
          
//           // Additional hiding after initialization
//           setTimeout(() => {
//             const banner = document.querySelector('.goog-te-banner-frame');
//             if (banner) {
//               banner.style.display = 'none';
//               banner.style.visibility = 'hidden';
//             }
            
//             const gadget = document.querySelector('.goog-te-gadget');
//             if (gadget) {
//               gadget.style.display = 'none';
//             }
//           }, 100);
//         }
//       };
//     }

//     const scriptId = "google-translate-script";
//     if (!document.getElementById(scriptId)) {
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src =
//         "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);
//     } else if (window.google && window.google.translate) {
//       window.googleTranslateElementInit();
//     }
    
//     // Continuous check to hide any reappearing elements
//     const hideTranslateElements = setInterval(() => {
//       const banners = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
//       banners.forEach(el => {
//         el.style.display = 'none';
//         el.style.visibility = 'hidden';
//         el.style.height = '0';
//       });
//     }, 500);
    
//     // Cleanup interval on component unmount
//     return () => clearInterval(hideTranslateElements);
//   }, []);

//   return <div id="google_translate_element" style={{display: 'none'}}></div>;
// }



'use client';

import { useState, useEffect } from 'react';

export default function GoogleTranslate({ onLanguageChange }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Clean up any existing Google Translate elements
    const cleanupExistingTranslate = () => {
      const existingScript = document.getElementById('google-translate-script');
      const existingWidget = document.getElementById('google_translate_element');
      
      if (existingScript) {
        existingScript.remove();
      }
      if (existingWidget) {
        existingWidget.remove();
      }
      
      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src.includes('translate.google')) {
          iframe.remove();
        }
      });
    };

    cleanupExistingTranslate();

    // Create isolated container for Google Translate
    const translateContainer = document.createElement('div');
    translateContainer.id = 'google_translate_element';
    translateContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 0;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    `;
    document.body.appendChild(translateContainer);

    // Load Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    // Define the callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
          
          setIsInitialized(true);
          
          // Set up language change detection
          const checkLanguage = setInterval(() => {
            try {
              const selectField = document.querySelector('.goog-te-combo');
              if (selectField && selectField.value !== currentLanguage) {
                const newLang = selectField.value;
                setCurrentLanguage(newLang);
                if (onLanguageChange) {
                  onLanguageChange(newLang);
                }
              }
            } catch (e) {
              // Ignore errors
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Google Translate initialization failed:', error);
        setIsInitialized(false);
      }
    };

    document.head.appendChild(script);

    return () => {
      cleanupExistingTranslate();
      delete window.googleTranslateElementInit;
    };
  }, [onLanguageChange, currentLanguage]);

  // Function to change language
  const changeLanguage = (langCode) => {
    try {
      // Method 1: Use Google's API directly
      if (window.google && window.google.translate) {
        const translateInstance = window.google.translate.TranslateElement.getInstance();
        if (translateInstance) {
          translateInstance.selectLanguage(langCode);
          setCurrentLanguage(langCode);
          if (onLanguageChange) {
            onLanguageChange(langCode);
          }
          return;
        }
      }

      // Method 2: Use the select field
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.value = langCode;
        selectField.dispatchEvent(new Event('change', { bubbles: true }));
        setCurrentLanguage(langCode);
        if (onLanguageChange) {
          onLanguageChange(langCode);
        }
      }
    } catch (error) {
      console.warn('Language change error:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
}



// "use client";

// import { useEffect } from "react";

// export default function GoogleTranslate() {
//   useEffect(() => {
//     // Ensure init callback is defined before the script loads
//     if (!window.googleTranslateElementInit) {
//       window.googleTranslateElementInit = () => {
//         if (window.google && window.google.translate) {
//           // Avoid double initialization (React Strict Mode or re-mounts)
//           const alreadyHasCombo = document.querySelector(
//             "#google_translate_element .goog-te-combo"
//           );
//           if (alreadyHasCombo) return;

//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: "en",
//               includedLanguages: "en,es,hi",
//               // layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//               autoDisplay: false,
//             },
//             "google_translate_element"
//           );
//         }
//       };
//     }

//     // Load the Google Translate script only once
//     const scriptId = "google-translate-script";
//     if (!document.getElementById(scriptId)) {
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src =
//         "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);
//     } else if (window.google && window.google.translate) {
//       // If already loaded, call init immediately
//       window.googleTranslateElementInit();
//     }
//   }, []);

//   return <div id="google_translate_element" className="hidden"></div>;
// }

