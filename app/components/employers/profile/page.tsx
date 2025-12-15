'use client';
import { useState } from 'react';
import { User, Bell, Search, Grid, FileText, CheckSquare, MessageSquare, TrendingUp, HelpCircle, Settings, LogOut, CheckCircle } from 'lucide-react';

// Sidebar Component
function Sidebar({ activePage = 'profile' }) {
  const menuItems = [
    { icon: Grid, label: 'My Dashboard', path: '/dashboard', id: 'dashboard' },
    { icon: User, label: 'My Profile', path: '/profile', id: 'profile' },
    { icon: FileText, label: 'Job Postings', path: '/job-postings', id: 'job-postings' },
    { icon: CheckSquare, label: 'Application Status', path: '/applications', id: 'applications' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback', id: 'feedback' },
    { icon: TrendingUp, label: 'Tracecoins', path: '/tracecoins', id: 'tracecoins' },
    { icon: HelpCircle, label: 'Support', path: '/support', id: 'support' },
    { icon: Settings, label: 'Settings', path: '/settings', id: 'settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen pt-20 fixed left-0 top-0">
      <div className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activePage === item.id
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-50 transition-colors mt-4">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded"></div>
            <span className="font-bold text-lg">TRACEWORK</span>
            <span className="text-xs text-gray-500">Jobs</span>
          </div>
          <h1 className="text-lg font-semibold">Employer's</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-orange-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Company Information Tab
function CompanyInformation({ formData, setFormData, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [name]: name === 'industry' ? parseInt(value) : value
      }
    }));
  };

  const industries = [
    { value: 0, label: 'Select Domain' },
    { value: 1, label: 'Technology' },
    { value: 2, label: 'Finance' },
    { value: 3, label: 'Healthcare' },
    { value: 4, label: 'Construction' },
    { value: 5, label: 'Retail' },
    { value: 6, label: 'Manufacturing' },
    { value: 7, label: 'Logistics' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name as per MCA <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.company.companyName}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company PAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pan"
            value={formData.company.pan}
            onChange={handleChange}
            disabled={loading}
            placeholder="AAAAA0000A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company GST <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="gst"
            value={formData.company.gst}
            onChange={handleChange}
            disabled={loading}
            placeholder="22AAAAA0000A1Z5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company TAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tan"
            value={formData.company.tan}
            onChange={handleChange}
            disabled={loading}
            placeholder="AAAA00000A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo URL
        </label>
        <div className="flex items-center gap-4">
          <input
            type="url"
            name="logoUrl"
            value={formData.company.logoUrl}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/logo.png"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Website <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="websiteUrl"
          value={formData.company.websiteUrl}
          onChange={handleChange}
          disabled={loading}
          placeholder="https://www.yourcompany.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Domain <span className="text-red-500">*</span>
        </label>
        <select 
          name="industry"
          value={formData.company.industry}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Strength <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="strength"
          value={formData.company.strength}
          onChange={handleChange}
          disabled={loading}
          placeholder="Number of employees"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={6}
          name="description"
          value={formData.company.description}
          onChange={handleChange}
          disabled={loading}
          placeholder="Describe your company..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>
    </div>
  );
}

// Contact Information Tab
function ContactInformation({ formData, setFormData, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile no. <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.contact.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="+91 1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.contact.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="company@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Company Location Details</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.contact.address}
          onChange={handleChange}
          disabled={loading}
          placeholder="Enter complete address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select 
            name="state"
            value={formData.contact.state}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select State</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="delhi">Delhi</option>
            <option value="west-bengal">West Bengal</option>
            <option value="tamil-nadu">Tamil Nadu</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.contact.city}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter city"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pin Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="pinCode"
          value={formData.contact.pinCode}
          onChange={handleChange}
          disabled={loading}
          placeholder="000000"
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Social Media Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.contact.linkedin}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.contact.instagram}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://instagram.com/yourcompany"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.contact.twitter}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://twitter.com/yourcompany"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Banking Information Tab
function BankingInformation({ formData, setFormData, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      banking: {
        ...prev.banking,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Account Holder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="accountHolderName"
          value={formData.banking.accountHolderName}
          onChange={handleChange}
          disabled={loading}
          placeholder="Account holder name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.banking.accountNumber}
          onChange={handleChange}
          disabled={loading}
          placeholder="Account number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bank Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.banking.bankName}
          onChange={handleChange}
          disabled={loading}
          placeholder="Bank name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="branchName"
            value={formData.banking.branchName}
            onChange={handleChange}
            disabled={loading}
            placeholder="Branch name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ifscCode"
            value={formData.banking.ifscCode}
            onChange={handleChange}
            disabled={loading}
            placeholder="IFSC code"
            maxLength={11}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );
}

// Success Modal
function SuccessModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Saved!</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your company profile has been submitted successfully and is pending approval.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Main Profile Component
export default function EmployerProfilePage() {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    company: {
      companyName: '',
      pan: '',
      gst: '',
      tan: '',
      logoUrl: '',
      websiteUrl: '',
      industry: 0,
      strength: '',
      description: '',
    },
    contact: {
      phone: '',
      email: '',
      address: '',
      state: '',
      city: '',
      pinCode: '',
      linkedin: '',
      instagram: '',
      twitter: '',
    },
    banking: {
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
    }
  });

  const tabs = [
    { id: 'company', label: 'Company Information' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'banking', label: 'Banking Information' },
  ];

  const validateForm = () => {
    // Company validation
    if (!formData.company.companyName.trim()) {
      setError('Company name is required');
      setActiveTab('company');
      return false;
    }
    if (!formData.company.pan.trim()) {
      setError('Company PAN is required');
      setActiveTab('company');
      return false;
    }
    if (formData.company.industry === 0) {
      setError('Please select a company domain');
      setActiveTab('company');
      return false;
    }

    // Contact validation
    if (!formData.contact.phone.trim()) {
      setError('Mobile number is required');
      setActiveTab('contact');
      return false;
    }
    if (!formData.contact.email.trim()) {
      setError('Email is required');
      setActiveTab('contact');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact.email)) {
      setError('Please enter a valid email address');
      setActiveTab('contact');
      return false;
    }
    if (!formData.contact.address.trim()) {
      setError('Company address is required');
      setActiveTab('contact');
      return false;
    }

    // Banking validation
    if (!formData.banking.accountNumber.trim()) {
      setError('Account number is required');
      setActiveTab('banking');
      return false;
    }
    if (!formData.banking.ifscCode.trim()) {
      setError('IFSC code is required');
      setActiveTab('banking');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Generate a unique company ID if not provided
      const companyId = `COMP-${Date.now()}`;

      // Prepare the complete payload
      const payload = {
        companyName: formData.company.companyName,
        companyId: companyId,
        address: `${formData.contact.address}, ${formData.contact.city}, ${formData.contact.state} - ${formData.contact.pinCode}`,
        email: formData.contact.email,
        phone: formData.contact.phone,
        industry: formData.company.industry,
        logoUrl: formData.company.logoUrl || '',
        websiteUrl: formData.company.websiteUrl || '',
        description: formData.company.description || '',
        // Additional metadata (you can extend your backend to accept these)
        metadata: {
          pan: formData.company.pan,
          gst: formData.company.gst,
          tan: formData.company.tan,
          strength: formData.company.strength,
          socialMedia: {
            linkedin: formData.contact.linkedin,
            instagram: formData.contact.instagram,
            twitter: formData.contact.twitter,
          },
          banking: {
            accountHolderName: formData.banking.accountHolderName,
            accountNumber: formData.banking.accountNumber,
            bankName: formData.banking.bankName,
            branchName: formData.banking.branchName,
            ifscCode: formData.banking.ifscCode,
          }
        }
      };

      const response = await fetch('/api/companies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save profile');
      }

      console.log('Profile saved successfully:', data);
      setShowSuccess(true);

    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activePage="profile" />
      
      <main className="ml-64 pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-8 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                    }}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'company' && (
                <CompanyInformation 
                  formData={formData} 
                  setFormData={setFormData}
                  loading={loading}
                />
              )}
              {activeTab === 'contact' && (
                <ContactInformation 
                  formData={formData} 
                  setFormData={setFormData}
                  loading={loading}
                />
              )}
              {activeTab === 'banking' && (
                <BankingInformation 
                  formData={formData} 
                  setFormData={setFormData}
                  loading={loading}
                />
              )}

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button 
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : activeTab === 'banking' ? 'Send for Approval' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SuccessModal 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </div>
  );
}