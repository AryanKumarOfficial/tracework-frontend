'use client';
import { useState } from 'react';
import { User, Bell, Search, Grid, FileText, CheckSquare, MessageSquare, TrendingUp, HelpCircle, Settings, LogOut, Edit, ExternalLink, Plus } from 'lucide-react';

// Sidebar Component
function Sidebar({ activePage = 'job-postings' }) {
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
    <div className="w-48 bg-white border-r border-gray-200 h-screen pt-16 fixed left-0 top-0 overflow-y-auto">
      <div className="p-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md mb-1 transition-colors text-sm ${
              activePage === item.id
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md mb-1 text-gray-600 hover:bg-gray-50 transition-colors mt-4 text-sm">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded"></div>
            <span className="font-bold text-base">TRACEWORK</span>
            <span className="text-xs text-gray-500">Jobs</span>
          </div>
          <h1 className="text-base font-semibold">Employer's</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Bell size={18} className="text-gray-600" />
          </button>
          <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center">
            <User size={18} className="text-orange-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Company Registration Page
function CompanyRegistrationPage({ onComplete }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyId: '',
    address: '',
    email: '',
    phone: '',
    industry: 0,
    logoUrl: '',
    websiteUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const industries = [
    { value: 0, label: 'Select Industry' },
    { value: 1, label: 'Technology' },
    { value: 2, label: 'Finance' },
    { value: 3, label: 'Healthcare' },
    { value: 4, label: 'Construction' },
    { value: 5, label: 'Retail' },
    { value: 6, label: 'Manufacturing' },
    { value: 7, label: 'Logistics' },
  ];

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'industry' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/companies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register company');
      }

      const data = await response.json();
      console.log('Company registered successfully:', data);
      onComplete();
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Registration</h2>
          <p className="text-sm text-gray-600">Register your company to start posting jobs</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Company ID <span className="text-red-500">*</span>
            </label>
            <input
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter unique company ID"
              required
            />
            <p className="text-xs text-gray-500 mt-1">This will be your unique identifier</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="company@example.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+91 1234567890"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {industries.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Company Logo URL
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended size: 200x200px</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://www.yourcompany.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Company Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Brief description about your company"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({ job, onEdit, onView }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
        <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 rounded">
          <Edit size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Salary</p>
          <p className="text-sm font-semibold">{job.salary}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Work Mode</p>
          <p className="text-sm font-semibold">{job.workMode}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Job Type</p>
          <p className="text-sm font-semibold">{job.jobType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Shift Time</p>
          <p className="text-sm font-semibold">{job.shiftTime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Openings</p>
          <p className="text-sm font-semibold">{job.openings}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <p className="text-sm font-semibold">{job.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Education</p>
          <p className="text-sm">{job.education}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Experience</p>
          <p className="text-sm">{job.experience}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Skill</p>
          <p className="text-sm">{job.skills}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Certification</p>
          <p className="text-sm">{job.certification}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Benefit</p>
        <p className="text-sm">{job.benefits}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onView}
          className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          View Job
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

// My Job Postings Page
function MyJobPostingsPage({ onAddJob, onViewJob }) {
  const jobs = [
    {
      id: 1,
      title: 'Photographer',
      salary: '₹20,000/month',
      workMode: 'Part Time',
      jobType: 'Permanent',
      shiftTime: 'Day Shift',
      openings: '3',
      location: 'Remote',
      education: "Bachelor's in Cinematography / Photography / Degree",
      experience: '0-1 years',
      skills: 'Creative Mind, Photography, Photoshop, Communication skill',
      certification: 'Any Course Certificate',
      benefits: 'Health Insurance, 5 Working Days'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activePage="job-postings" />
      
      <main className="ml-48 pt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-md shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">Job Postings</h2>
              <button
                onClick={onAddJob}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
              >
                <Plus size={18} />
                Add Job Posting
              </button>
            </div>

            <div className="border-b border-gray-200 mb-5">
              <div className="flex gap-6">
                <button className="pb-3 text-sm font-medium border-b-2 border-orange-500 text-orange-600">
                  My Job Postings
                </button>
                <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Add Job Posting
                </button>
              </div>
            </div>

            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={() => onAddJob(job)}
                onView={() => onViewJob(job)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add Job Posting Form
function AddJobPostingPage({ onCancel, onSave }) {
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activePage="job-postings" />
      
      <main className="ml-48 pt-16 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-md shadow-sm p-6">
            <div className="mb-6">
              <button
                onClick={onCancel}
                className="text-orange-600 hover:underline mb-3 text-sm"
              >
                ← Back to Job Postings
              </button>
              <h2 className="text-xl font-bold text-gray-900">Add Job Posting</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Name of the Designation
                </label>
                <input className={inputClass} placeholder="Enter designation" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Work Mode</label>
                <div className="flex gap-4 text-sm">
                  {['Part Time', 'Full Time', 'Internship'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5">
                      <input type="radio" name="workMode" className="w-4 h-4" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Job Type</label>
                <div className="flex gap-4 text-sm">
                  {['Permanent', 'Contractual'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5">
                      <input type="radio" name="jobType" className="w-4 h-4" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Shift Time</label>
                <div className="flex gap-4 text-sm">
                  {['Day', 'Night', 'Flexible'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5">
                      <input type="radio" name="shift" className="w-4 h-4" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Number of Openings
                </label>
                <select className={inputClass}>
                  <option>Select the number of openings</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Salary</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className={inputClass}>
                    <option>Select per month</option>
                    <option>₹10,000 - ₹20,000</option>
                    <option>₹20,000 - ₹30,000</option>
                    <option>₹30,000 - ₹50,000</option>
                  </select>
                  <select className={inputClass}>
                    <option>Select per year</option>
                    <option>₹1L - ₹3L</option>
                    <option>₹3L - ₹5L</option>
                    <option>₹5L - ₹10L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Location</label>
                <div className="flex gap-4 text-sm">
                  {['Remote', 'Office', 'Hybrid'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5">
                      <input type="radio" name="location" className="w-4 h-4" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Job Description
                </label>
                <textarea rows={4} className={inputClass} placeholder="Enter job description" />
                <p className="text-xs text-gray-400 text-right mt-1">
                  4000 Characters left
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Job Requirement Heading</label>
                <select className={inputClass}>
                  <option>Select job requirement heading</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Experience</label>
                <select className={inputClass}>
                  <option>Select experience</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Education</label>
                <select className={inputClass}>
                  <option>Select education</option>
                  <option>High School</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Skills</label>
                <select className={inputClass}>
                  <option>Select skills</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Certifications
                </label>
                <input className={inputClass} placeholder="Any certifications" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Benefits</label>
                <input className={inputClass} placeholder="Mention benefits" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Assessment Test
                </label>
                <textarea rows={2} className={inputClass} placeholder="Add assessment test" />
                <p className="text-xs text-gray-400 text-right mt-1">Only 2 left</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={onCancel}
                className="px-5 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={onSave}
                className="px-5 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800"
              >
                Post Job
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// View Job Page
function ViewJobPage({ job, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activePage="job-postings" />
      
      <main className="ml-48 pt-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-md shadow-sm p-6">
            <div className="mb-4">
              <button
                onClick={onBack}
                className="text-orange-600 hover:underline mb-3 text-xs"
              >
                ← Back to Job Postings
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Graphic Designer</h2>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>Full-time</span>
                <span>•</span>
                <span>2-4 years</span>
                <span>•</span>
                <span>Posted 10 days ago</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs">
                Shortlisted
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md text-xs">
                5 Applied
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md text-xs">
                4 In-process
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md text-xs">
                4 Hired
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-md text-xs">
                3 Interviewed
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  We are seeking a talented Graphic Designer with a passion for visual storytelling and creating engaging content that resonates with our audience. The ideal candidate will have experience designing across multiple platforms, from digital to print, and will work closely with our marketing and product teams to bring our brand to life. You'll be responsible for designing marketing materials, social media graphics, email templates, and other promotional content.
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mt-2">
                  The Graphic Designer will collaborate with cross-functional teams to ensure design consistency across all touchpoints and maintain brand integrity while pushing creative boundaries. You will need a sharp eye for design trends, strong layout skills, and expertise in Adobe Creative Suite.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">More Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-500">SALARY (INR)</p>
                    <p className="text-xs font-semibold">₹15,000 - ₹30,000 / Month</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">WORK MODE</p>
                    <p className="text-xs font-semibold">On site</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Education</p>
                    <p className="text-xs font-semibold">Bachelor's Degree</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Certification</p>
                    <p className="text-xs font-semibold">Professional Certificate</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px]">Photoshop</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px]">Illustrator</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px]">Communication Skill</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Benefit</h3>
                <p className="text-xs text-gray-700">
                  Health Insurance, Flexible Work Hours, Professional Development, Work from Home
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App Component
export default function JobPostingApp() {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      {currentPage === 'list' && (
        <MyJobPostingsPage
          onAddJob={() => setCurrentPage('add')}
          onViewJob={(job) => {
            setSelectedJob(job);
            setCurrentPage('view');
          }}
        />
      )}
      {currentPage === 'add' && (
        <AddJobPostingPage
          onCancel={() => setCurrentPage('list')}
          onSave={() => setCurrentPage('list')}
        />
      )}
      {currentPage === 'view' && (
        <ViewJobPage
          job={selectedJob}
          onBack={() => setCurrentPage('list')}
        />
      )}
    </>
  );
}