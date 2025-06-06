'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud, Palette, CheckSquare, Square } from 'lucide-react';

const planTypes = [
  { id: 'basic', name: 'Basic' },
  { id: 'pro', name: 'Pro' },
  { id: 'enterprise', name: 'Enterprise' },
];

const allFeatures = [
  { id: 'estimates', name: 'Estimates' },
  { id: 'payments', name: 'Online Payments' },
  { id: 'crm', name: 'Customer CRM' },
  { id: 'notifications', name: 'Automated Notifications' },
  { id: 'scheduling', name: 'Advanced Scheduling' },
  { id: 'reporting', name: 'Reporting & Analytics' },
];

const predefinedThemes = [
  { name: 'Forest Green', primary: '#228B22', secondary: '#90EE90' },
  { name: 'Ocean Blue', primary: '#007bff', secondary: '#ADD8E6' },
  { name: 'Sunset Orange', primary: '#FF8C00', secondary: '#FFDAB9' },
  { name: 'Modern Gray', primary: '#6c757d', secondary: '#f8f9fa' }, 
];

export default function CreateNewTenantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    subdomain: '',
    contactEmail: '',
    contactPhone: '',
    planType: planTypes[0].id,
    logo: null,
    brandingTheme: predefinedThemes[0].primary,
    enabledFeatures: [],
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'businessName') {
      const suggestedSubdomain = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, subdomain: suggestedSubdomain }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: null }));
      }
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      enabledFeatures: prev.enabledFeatures.includes(featureId)
        ? prev.enabledFeatures.filter(id => id !== featureId)
        : [...prev.enabledFeatures, featureId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.subdomain)) newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email format.';
    // Add more validations as needed (e.g., phone format, logo size/type)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Placeholder for API call
    console.log('Form Data Submitted:', formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // alert('Tenant created successfully! (Placeholder)'); // Replace with toast notification
    router.push('/super-admin/tenants'); // Redirect to tenant list
  };

  const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, children }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children || <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'}`}
      />}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Tenant List
      </button>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Create New Tenant</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Business Name" name="businessName" value={formData.businessName} onChange={handleInputChange} error={errors.businessName} placeholder="e.g., GreenScape Landscaping" />
          <InputField label="Subdomain" name="subdomain" value={formData.subdomain} onChange={handleInputChange} error={errors.subdomain} placeholder="e.g., greenscape (will become greenscape.gardningweb.com)" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Contact Email" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} error={errors.contactEmail} placeholder="e.g., contact@greenscape.com" />
          <InputField label="Contact Phone (Optional)" name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleInputChange} placeholder="e.g., (555) 123-4567" />
        </div>
        
        <InputField label="Subscription Plan" name="planType" error={errors.planType}>
          <select 
            name="planType" 
            id="planType" 
            value={formData.planType} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            {planTypes.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
          </select>
        </InputField>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-md object-cover bg-gray-100 dark:bg-gray-700" />}
            <label htmlFor="logo" className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-md shadow-sm inline-flex items-center transition-colors">
              <UploadCloud size={18} className="mr-2" /> Upload Logo
            </label>
            <input id="logo" name="logo" type="file" className="sr-only" onChange={handleLogoChange} accept="image/png, image/jpeg, image/svg+xml" />
          </div>
          {formData.logo && <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Selected: {formData.logo.name}</p>}
          {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
        </div>

        <InputField label="Branding Theme (Primary Color)" name="brandingTheme" error={errors.brandingTheme}>
          <div className="flex items-center space-x-2 mt-1">
            {predefinedThemes.map(theme => (
              <button 
                key={theme.name} 
                type="button"
                title={theme.name}
                onClick={() => setFormData(prev => ({ ...prev, brandingTheme: theme.primary }))}
                className={`w-8 h-8 rounded-full border-2 transition-all ${formData.brandingTheme === theme.primary ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-green-500 border-white dark:border-gray-600' : 'border-transparent hover:ring-1 hover:ring-gray-400'}`}
                style={{ backgroundColor: theme.primary }}
              />
            ))}
            <input 
              type="color" 
              value={formData.brandingTheme} 
              onChange={(e) => setFormData(prev => ({...prev, brandingTheme: e.target.value}))} 
              className="w-8 h-8 rounded-md border-gray-300 dark:border-gray-600 shadow-sm cursor-pointer"
            />
          </div>
        </InputField>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enabled Features</label>
          <div className="space-y-2">
            {allFeatures.map(feature => (
              <label key={feature.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.enabledFeatures.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                />
                <div className="w-5 h-5 border border-gray-400 dark:border-gray-500 rounded flex items-center justify-center peer-checked:bg-green-500 peer-checked:border-green-500">
                  {formData.enabledFeatures.includes(feature.id) && <CheckSquare size={14} className="text-white" />}
                  {!formData.enabledFeatures.includes(feature.id) && <Square size={14} className="text-transparent" />}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{feature.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            onClick={() => router.push('/super-admin/tenants')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
}
