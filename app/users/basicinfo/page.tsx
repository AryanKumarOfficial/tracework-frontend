'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Edit2, Plus, Play, Trash2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

const PHOTOGRAPHY_CATEGORIES = [
  'Wedding Photography',
  'Portrait Photography',
  'Event Photography',
  'Commercial Photography',
  'Fine Art Photography',
  'Sports Photography',
  'Travel Photography',
  'Pet Photography',
  'Newborn and Maternity Photography',
  'Architectural Photography',
  'Documentary Photography',
  'Candid Photography',
  'Fashion Photography',
  'Food Photography',
  'Product Photography',
];

const apiClient = {
  getToken() {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      if (tokenCookie) return tokenCookie.split('=')[1];
    }
    return null;
  },

  async request(endpoint, options = {}) {
    try {
      const token = this.getToken();
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log('📤 API Request:', {
        url: fullUrl,
        method: options.method || 'GET',
        hasToken: !!token,
        body: options.body ? JSON.parse(options.body) : null,
      });

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('❌ API Error:', error);
        throw new Error(error.message || error.error || 'Request failed');
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  },

  async uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/upload`, {
      method: 'POST',
      body: formData,
      headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceCategoryModal, setShowServiceCategoryModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    dobDate: '',
    dobMonth: '',
    dobYear: '',
    gender: '',
    experience: '',
    availability: '',
    permanentAddress: '',
    hometown: '',
    pincode: '',
    profilePicture: '',
    languages: [{ language: 'English', proficiency: 'Intermediate', read: true, write: false, speak: false }],
  });

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    type: '',
    description: '',
    experienceYears: 0,
    experienceMonths: 0,
  });

  const [portfolio, setPortfolio] = useState([]);
  const [portfolioForm, setPortfolioForm] = useState({
    projectName: '',
    projectCaption: '',
    projectTags: [],
    projectCategory: '',
    visibility: 'public',
    media: [],
    mediaType: 'image',
  });
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const genderOptions = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' },
    { value: '3', label: 'Others' }
  ];

  const experienceOptions = [
    { value: '1', label: 'Fresher' },
    { value: '2', label: 'Experienced' }
  ];

  const availabilityOptions = [
    { value: '1', label: 'Immediately' },
    { value: '2', label: 'Within a week' },
    { value: '3', label: 'Within 15 days' }
  ];

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'services') loadServices();
    if (activeTab === 'portfolio') loadPortfolio();
  }, [activeTab]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setSuccessMessage('');
    }, 3000);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await apiClient.request('/api/v1/users/me');
      const user = result.user || result.data?.user || result.data || result;
      
      if (!user) throw new Error('Failed to load user data');

      let dobDate = '', dobMonth = '', dobYear = '';
      const dateOfBirth = user.dateOfBirth || user.date_of_birth;
      if (dateOfBirth) {
        const date = new Date(dateOfBirth);
        if (!isNaN(date.getTime())) {
          dobDate = String(date.getDate());
          dobMonth = String(date.getMonth() + 1);
          dobYear = String(date.getFullYear());
        }
      }

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone_number || '',
        location: user.location || '',
        dobDate,
        dobMonth,
        dobYear,
        gender: user.gender ? String(user.gender) : '',
        experience: user.experience ? String(user.experience) : '',
        availability: user.availability ? String(user.availability) : '',
        permanentAddress: user.permanentAddress || user.permanent_address || '',
        hometown: user.hometown || '',
        pincode: user.pincode || '',
        profilePicture: user.profilePicture || user.profile_picture || '',
        languages: user.languages && user.languages.length > 0 ? user.languages : [{ language: 'English', proficiency: 'Intermediate', read: true, write: false, speak: false }],
      });
    } catch (error) {
      showSuccess(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const result = await apiClient.request('/api/v1/users/services');
      
      let servicesData = [];
      if (result.success && result.data?.services) {
        servicesData = result.data.services;
      } else if (Array.isArray(result.services)) {
        servicesData = result.services;
      } else if (result.data && Array.isArray(result.data)) {
        servicesData = result.data;
      } else if (Array.isArray(result)) {
        servicesData = result;
      }
      
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]);
    }
  };

  const loadPortfolio = async () => {
    try {
      const result = await apiClient.request('/api/v1/users/portfolio');
      
      let portfolioData = [];
      if (result.success && result.data?.portfolio) {
        portfolioData = result.data.portfolio;
      } else if (Array.isArray(result.portfolio)) {
        portfolioData = result.portfolio;
      } else if (result.data && Array.isArray(result.data)) {
        portfolioData = result.data;
      } else if (Array.isArray(result)) {
        portfolioData = result;
      }
      
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      setPortfolio([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setFormData(prev => ({ ...prev, languages: newLanguages }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: 'Beginner', read: false, write: false, speak: false }]
    }));
  };

  const removeLanguage = (index) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, languages: newLanguages }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let dateOfBirth = '';
      if (formData.dobYear && formData.dobMonth && formData.dobDate) {
        const month = formData.dobMonth.padStart(2, '0');
        const date = formData.dobDate.padStart(2, '0');
        dateOfBirth = `${formData.dobYear}-${month}-${date}`;
      }

      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber;
      if (formData.location) updateData.location = formData.location;
      if (formData.permanentAddress) updateData.permanentAddress = formData.permanentAddress;
      if (formData.hometown) updateData.hometown = formData.hometown;
      if (formData.pincode) updateData.pincode = formData.pincode;
      if (formData.profilePicture) updateData.profilePicture = formData.profilePicture;
      if (formData.languages) updateData.languages = formData.languages;
      if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
      if (formData.gender) updateData.gender = Number(formData.gender);
      if (formData.experience) updateData.experience = Number(formData.experience);
      if (formData.availability) updateData.availability = Number(formData.availability);

      const result = await apiClient.request('/api/v1/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (result.success) {
        showSuccess('Profile Saved Successfully');
        await loadProfile();
      } else {
        showSuccess(result.error || 'Failed to save profile');
      }
    } catch (error) {
      showSuccess(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showSuccess('File size must be less than 50MB');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.uploadFile(file, type);
      
      if (result.success && result.data?.url) {
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profilePicture: result.data.url }));
          showSuccess('Profile picture uploaded successfully');
        }
      } else {
        showSuccess('Failed to upload file');
      }
    } catch (error) {
      showSuccess(error.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        type: service.type,
        description: service.description,
        experienceYears: service.experienceYears || 0,
        experienceMonths: service.experienceMonths || 0,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        type: '',
        description: '',
        experienceYears: 0,
        experienceMonths: 0,
      });
    }
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async () => {
    try {
      if (!serviceForm.type) {
        showSuccess('Please select a service type');
        return;
      }
      
      setLoading(true);
      
      const payload = {
        type: serviceForm.type,
        description: serviceForm.description,
        experienceYears: Number(serviceForm.experienceYears) || 0,
        experienceMonths: Number(serviceForm.experienceMonths) || 0,
      };
      
      let result;
      if (editingService) {
        result = await apiClient.request(`/api/v1/users/services/${editingService.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        result = await apiClient.request('/api/v1/users/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      
      if (result.success || result.message) {
        showSuccess(editingService ? 'Service updated successfully' : 'Service added successfully');
        await loadServices();
        setShowServiceModal(false);
        setShowServiceCategoryModal(false);
      } else {
        showSuccess(result.error || 'Failed to save service');
      }
    } catch (error) {
      showSuccess(error.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      setLoading(true);
      const result = await apiClient.request(`/api/v1/users/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (result.success || result.message) {
        showSuccess('Service deleted successfully');
        await loadServices();
      } else {
        showSuccess(result.error || 'Failed to delete service');
      }
    } catch (error) {
      showSuccess(error.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const openPortfolioModal = (item = null) => {
    if (item) {
      setEditingPortfolio(item);
      setPortfolioForm({
        projectName: item.projectName,
        projectCaption: item.projectCaption,
        projectTags: item.projectTags || [],
        projectCategory: item.projectCategory,
        visibility: item.visibility || 'public',
        media: item.media || [],
        mediaType: item.mediaType || 'image',
      });
    } else {
      setEditingPortfolio(null);
      setPortfolioForm({
        projectName: '',
        projectCaption: '',
        projectTags: [],
        projectCategory: '',
        visibility: 'public',
        media: [],
        mediaType: 'image',
      });
    }
    setPortfolioFiles([]);
    setShowPortfolioModal(true);
  };

  const handlePortfolioFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setPortfolioFiles(files);
  };

  const removePortfolioFile = (index) => {
    setPortfolioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index) => {
    setPortfolioForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handlePortfolioSubmit = async () => {
    try {
      if (!portfolioForm.projectName || !portfolioForm.projectCategory) {
        showSuccess('Please fill in project name and category');
        return;
      }

      setLoading(true);
      setUploadingFiles(true);

      const uploadedUrls = [];
      for (const file of portfolioFiles) {
        try {
          const result = await apiClient.uploadFile(file, 'portfolio');
          if (result.success && result.data?.url) {
            uploadedUrls.push(result.data.url);
          } else if (result.data?.url) {
            uploadedUrls.push(result.data.url);
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
        }
      }

      setUploadingFiles(false);

      const finalMedia = [...portfolioForm.media, ...uploadedUrls];
      
      const payload = {
        projectName: portfolioForm.projectName,
        projectCaption: portfolioForm.projectCaption,
        projectTags: portfolioForm.projectTags,
        projectCategory: portfolioForm.projectCategory,
        visibility: portfolioForm.visibility,
        media: finalMedia,
        mediaType: portfolioForm.mediaType,
      };

      let result;
      if (editingPortfolio) {
        result = await apiClient.request(`/api/v1/users/portfolio/${editingPortfolio.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showSuccess('Portfolio updated successfully');
      } else {
        result = await apiClient.request('/api/v1/users/portfolio', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showSuccess('Portfolio item added successfully');
      }

      await loadPortfolio();
      setShowPortfolioModal(false);
      setPortfolioFiles([]);
    } catch (error) {
      showSuccess(error.message || 'Failed to save portfolio item');
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  const deletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    
    try {
      setLoading(true);
      const result = await apiClient.request(`/api/v1/users/portfolio/${portfolioId}`, {
        method: 'DELETE',
      });
      
      if (result.success || result.message) {
        showSuccess('Portfolio item deleted successfully');
        await loadPortfolio();
      } else {
        showSuccess(result.error || 'Failed to delete portfolio item');
      }
    } catch (error) {
      showSuccess(error.message || 'Failed to delete portfolio item');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-8 text-center max-w-sm w-full mx-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-800">{successMessage}</p>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowServiceModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                <input
                  type="text"
                  placeholder="Click to select a service"
                  value={serviceForm.type}
                  onClick={() => setShowServiceCategoryModal(true)}
                  readOnly
                  className="w-full border border-gray-300 p-2.5 rounded text-sm cursor-pointer hover:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                <textarea
                  placeholder="Describe the service you provide..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 p-2.5 rounded text-sm resize-none"
                  rows={4}
                  maxLength={4000}
                />
                <p className="text-xs text-gray-500 text-right mt-1">{serviceForm.description.length}/4000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Experience</label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={serviceForm.experienceYears}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                    className="border border-gray-300 p-2.5 rounded text-sm"
                  >
                    <option value="0">0 Years</option>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(y => (
                      <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>
                    ))}
                  </select>
                  <select
                    value={serviceForm.experienceMonths}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, experienceMonths: e.target.value }))}
                    className="border border-gray-300 p-2.5 rounded text-sm"
                  >
                    <option value="0">0 Months</option>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowServiceModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleServiceSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showServiceCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowServiceCategoryModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose Service</h3>
              <button onClick={() => setShowServiceCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {PHOTOGRAPHY_CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="serviceCategory"
                    checked={serviceForm.type === category}
                    onChange={() => {
                      setServiceForm(prev => ({ ...prev, type: category }));
                      setShowServiceCategoryModal(false);
                    }}
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => !uploadingFiles && setShowPortfolioModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{editingPortfolio ? 'Edit Project' : 'Add Your Project'}</h3>
              <button 
                onClick={() => setShowPortfolioModal(false)} 
                disabled={uploadingFiles}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPortfolioForm(prev => ({ ...prev, mediaType: 'image' }))}
                        className={`flex-1 p-6 border-2 rounded-lg flex flex-col items-center gap-2 ${
                          portfolioForm.mediaType === 'image' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                        }`}
                      >
                        <Upload className="w-8 h-8 text-gray-600" />
                        <span className="text-sm font-medium">Image</span>
                      </button>
                      <button
                        onClick={() => setPortfolioForm(prev => ({ ...prev, mediaType: 'video' }))}
                        className={`flex-1 p-6 border-2 rounded-lg flex flex-col items-center gap-2 ${
                          portfolioForm.mediaType === 'video' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                        }`}
                      >
                        <Play className="w-8 h-8 text-gray-600" />
                        <span className="text-sm font-medium">Video</span>
                      </button>
                    </div>
                  </div>

                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload {portfolioForm.mediaType}s</p>
                      <p className="text-xs text-gray-400 mt-1">Max 50MB</p>
                    </div>
                    <input
                      type="file"
                      accept={portfolioForm.mediaType === 'image' ? 'image/*' : 'video/*'}
                      multiple
                      onChange={handlePortfolioFileSelect}
                      className="hidden"
                    />
                  </label>

                  {portfolioFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">{portfolioFiles.length} file(s) selected</p>
                      <div className="space-y-1">
                        {portfolioFiles.map((file, i) => (
                          <p key={i} className="text-xs text-gray-600">{file.name}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      placeholder="Type name as a profile"
                      value={portfolioForm.projectName}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, projectName: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Write a Caption for the project</label>
                    <textarea
                      placeholder="Type here..."
                      value={portfolioForm.projectCaption}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, projectCaption: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 rounded text-sm resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Category</label>
                    <select
                      value={portfolioForm.projectCategory}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, projectCategory: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 rounded text-sm"
                    >
                      <option value="">Select a category</option>
                      {PHOTOGRAPHY_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Tags (Optional)</label>
                    <input
                      type="text"
                      placeholder="Add tags separated by comma"
                      value={portfolioForm.projectTags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        setPortfolioForm(prev => ({ ...prev, projectTags: tags }));
                      }}
                      className="w-full border border-gray-300 p-2.5 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                    <select
                      value={portfolioForm.visibility}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, visibility: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 rounded text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
              <button
                onClick={() => setShowPortfolioModal(false)}
                disabled={uploadingFiles}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePortfolioSubmit}
                disabled={loading || uploadingFiles}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {uploadingFiles ? 'Uploading...' : loading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

        <div className="bg-white rounded-t-lg shadow-sm">
          <div className="flex border-b">
            <button onClick={() => setActiveTab('basic')} className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>
              Basic Information
            </button>
            <button onClick={() => setActiveTab('services')} className={`px-6 py-3 font-medium ${activeTab === 'services' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>
              Services
            </button>
            <button onClick={() => setActiveTab('portfolio')} className={`px-6 py-3 font-medium ${activeTab === 'portfolio' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>
              Portfolio
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'basic' && (
              <div>
                <div className="mb-8">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="text-orange-500 text-sm mt-2 font-medium cursor-pointer block">
                    Upload Picture
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'profile')} disabled={loading} />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input name="name" value={formData.name} placeholder="Random Name" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input name="email" value={formData.email} placeholder="email@example.com" className="w-full border border-gray-300 p-2.5 rounded text-sm bg-gray-100" disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input name="phoneNumber" value={formData.phoneNumber} placeholder="+91 1234567890" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input name="location" value={formData.location} placeholder="Delhi" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
                  <div className="grid grid-cols-3 gap-4">
                    <select name="dobDate" value={formData.dobDate} onChange={handleChange} className="border border-gray-300 p-2.5 rounded text-sm">
                      <option value="">Date</option>
                      {dates.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} className="border border-gray-300 p-2.5 rounded text-sm">
                      <option value="">Month</option>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select name="dobYear" value={formData.dobYear} onChange={handleChange} className="border border-gray-300 p-2.5 rounded text-sm">
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                  <div className="flex gap-6">
                    {genderOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value={option.value} checked={formData.gender === option.value} onChange={handleChange} className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Experience</label>
                  <div className="flex gap-6">
                    {experienceOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="experience" value={option.value} checked={formData.experience === option.value} onChange={handleChange} className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
                  <div className="flex gap-6 flex-wrap">
                    {availabilityOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="availability" value={option.value} checked={formData.availability === option.value} onChange={handleChange} className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Address</label>
                  <input name="permanentAddress" value={formData.permanentAddress} placeholder="Enter address" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hometown</label>
                    <input name="hometown" value={formData.hometown} placeholder="Delhi" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input name="pincode" value={formData.pincode} placeholder="110001" className="w-full border border-gray-300 p-2.5 rounded text-sm" onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
                  {formData.languages.map((lang, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <select value={lang.language} onChange={(e) => handleLanguageChange(index, 'language', e.target.value)} className="border border-gray-300 p-2.5 rounded text-sm">
                          <option>English</option>
                          <option>Hindi</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                        <select value={lang.proficiency} onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)} className="border border-gray-300 p-2.5 rounded text-sm">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={lang.read} onChange={(e) => handleLanguageChange(index, 'read', e.target.checked)} className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-700">Read</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={lang.write} onChange={(e) => handleLanguageChange(index, 'write', e.target.checked)} className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-700">Write</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={lang.speak} onChange={(e) => handleLanguageChange(index, 'speak', e.target.checked)} className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-700">Speak</span>
                          </label>
                        </div>
                        {formData.languages.length > 1 && (
                          <button onClick={() => removeLanguage(index)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={addLanguage} className="text-orange-500 text-sm font-medium hover:underline">Add languages</button>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Services</h2>
                  <button
                    onClick={() => openServiceModal()}
                    className="px-6 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800"
                  >
                    Add Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No services added yet. Click "Add Service" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{service.type}</h3>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <p className="text-sm">{service.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-sm">{service.description || 'No description'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Experience</p>
                                <p className="text-sm">{service.experienceYears || 0} years {service.experienceMonths || 0} months</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => openServiceModal(service)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Photos</h2>
                  <button
                    onClick={() => {
                      setPortfolioForm(prev => ({ ...prev, mediaType: 'image' }));
                      openPortfolioModal();
                    }}
                    className="px-6 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 mb-6"
                  >
                    Add Photos
                  </button>

                  {portfolio.filter(p => p.mediaType === 'image').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No photos added yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {portfolio.filter(p => p.mediaType === 'image').map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-gray-100">
                            {item.media && item.media[0] && (
                              <img src={item.media[0]} alt={item.projectName} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1">{item.projectName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.projectCaption}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPortfolioModal(item)}
                                className="text-orange-500 text-sm hover:underline flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => deletePortfolio(item.id)}
                                className="text-red-500 text-sm hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">Videos</h2>
                  <button
                    onClick={() => {
                      setPortfolioForm(prev => ({ ...prev, mediaType: 'video' }));
                      openPortfolioModal();
                    }}
                    className="px-6 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 mb-6"
                  >
                    Add Videos
                  </button>

                  {portfolio.filter(p => p.mediaType === 'video').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No videos added yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {portfolio.filter(p => p.mediaType === 'video').map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-gray-100 relative">
                            {item.media && item.media[0] && (
                              <video src={item.media[0]} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                                <Play className="w-8 h-8 text-gray-700" />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1">{item.projectName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.projectCaption}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPortfolioModal(item)}
                                className="text-orange-500 text-sm hover:underline flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => deletePortfolio(item.id)}
                                className="text-red-500 text-sm hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 bg-white p-6 rounded-b-lg shadow-sm">
          <button onClick={() => window.location.reload()} className="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}