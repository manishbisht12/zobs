"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  DollarSign, 
  FileText, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  X,
  Save,
  CheckCircle
} from 'lucide-react';
import api from '../../../../utils/api';
import { toast } from 'react-toastify';

export default function PostJobPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'full-time',
    workplaceType: 'on-site',
    experience: 'entry',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    category: '',
    skills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: '',
    companyWebsite: '',
    applicationDeadline: '',
    numberOfOpenings: '1'
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep1();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const newErrors = validateStep2();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Posting your job...', {
        position: "top-right",
      });

      // Prepare job data for API
      const jobData = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        location: formData.location,
        jobType: formData.jobType,
        workplaceType: formData.workplaceType,
        experience: formData.experience,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        currency: formData.currency,
        category: formData.category,
        skills: formData.skills,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        benefits: formData.benefits,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        companyWebsite: formData.companyWebsite,
        applicationDeadline: formData.applicationDeadline || null,
        numberOfOpenings: formData.numberOfOpenings ? Number(formData.numberOfOpenings) : 1,
        status: 'active', // Default to active when posting
      };

      // Make API call
      const response = await api.post('/employer/jobs', jobData);
      
      if (response.data.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Job posted successfully!', {
          position: "top-right",
          autoClose: 2000,
        });
        
        // Navigate back to jobs listing
        router.push('/employer/jobs');
      } else {
        toast.dismiss(loadingToast);
        throw new Error(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Failed to post job:', error);
      
      // Handle different error types
      let errorMessage = 'Failed to post job. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    // For draft, we need minimum required fields for backend validation
    if (!formData.jobTitle.trim() || !formData.companyName.trim() || !formData.location.trim()) {
      alert('Please fill in at least Job Title, Company Name, and Location to save as draft.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get user email from localStorage for contact email if not provided
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const defaultEmail = user.email || 'employer@example.com';

      const jobData = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        location: formData.location,
        jobType: formData.jobType,
        workplaceType: formData.workplaceType,
        experience: formData.experience,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        currency: formData.currency,
        category: formData.category || '',
        skills: formData.skills || '',
        description: formData.description || 'Draft - description will be added later',
        responsibilities: formData.responsibilities || '',
        requirements: formData.requirements || '',
        benefits: formData.benefits || '',
        contactEmail: formData.contactEmail || defaultEmail,
        contactPhone: formData.contactPhone || '',
        companyWebsite: formData.companyWebsite || '',
        applicationDeadline: formData.applicationDeadline || null,
        numberOfOpenings: formData.numberOfOpenings ? Number(formData.numberOfOpenings) : 1,
        status: 'draft', // Save as draft
      };

      // Show loading toast
      const loadingToast = toast.loading('Saving draft...', {
        position: "top-right",
      });

      const response = await api.post('/employer/jobs', jobData);
      
      if (response.data.success) {
        toast.dismiss(loadingToast);
        toast.success('Draft saved successfully!', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.dismiss(loadingToast);
        throw new Error(response.data.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      
      // Fallback to localStorage if API fails
      try {
        localStorage.setItem('jobDraft', JSON.stringify({
          ...formData,
          savedAt: new Date().toISOString()
        }));
        toast.info('Draft saved locally!', {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (localError) {
        toast.error('Failed to save draft.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/employer/jobs');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details below to attract the best candidates</p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
          title="Cancel"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-gray-900' : 'text-green-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step === 1 ? 'bg-gray-900 text-white' : 'bg-green-600 text-white'
            }`}>
              {step === 1 ? '1' : <CheckCircle className="w-6 h-6" />}
            </div>
            <span className="font-medium">Basic Info & Salary</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 rounded mx-4">
            <div className={`h-full rounded transition-all duration-300 ${
              step === 2 ? 'bg-gray-900 w-full' : 'bg-gray-300 w-0'
            }`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step === 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              2
            </div>
            <span className="font-medium">Job Details & Contact</span>
          </div>
        </div>
      </div>

      {/* Step 1: Basic Information & Salary */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition ${
                    errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY or Remote"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Technology, Marketing, Sales"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition bg-white"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workplace Type
                </label>
                <select
                  name="workplaceType"
                  value={formData.workplaceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition bg-white"
                >
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition bg-white"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings
                </label>
                <input
                  type="number"
                  name="numberOfOpenings"
                  value={formData.numberOfOpenings}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Salary Range Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Salary Range</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="80000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Job Details & Contact Information */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Job Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Python (comma separated)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Provide a detailed description of the role, company culture, and what makes this opportunity unique..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  placeholder="List the main responsibilities and day-to-day tasks..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="List the qualifications, education, and experience requirements..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Health insurance, 401k, Remote work, Flexible hours, Stock options..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://www.company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Posting...
                  </>
                ) : (
                  <>
                    Post Job
                    <Briefcase className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

