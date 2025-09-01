// components/LanguageSelector.js
import React, { useState } from 'react';

const LanguageSelector = ({ onLanguageChange, currentLanguage, isTranslateInitialized }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    // Add more languages as needed
  ];

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
    
    // If using Google Translate, you might need to trigger it here
    if (window.google && window.google.translate) {
      const selectField = window.document.querySelector(".goog-te-combo");
      if (selectField) {
        selectField.value = langCode;
        selectField.dispatchEvent(new Event('change'));
      }
    }
  };

  if (!isTranslateInitialized) {
    return null; // Or a loading state
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {languages.find(lang => lang.code === currentLanguage)?.name || 'Language'}
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === language.code 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;