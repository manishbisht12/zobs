"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Send } from "lucide-react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  resumeUrl: "",
  coverLetter: "",
};

const statusMessage = (job) => {
  if (!job) return "";
  if (job.companyName) {
    return `You're applying to ${job.companyName}`;
  }
  return "";
};

export default function ApplyModal({ open, onClose, onSubmit, loading, job, defaultValues = {} }) {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormValues((prev) => ({
        ...prev,
        ...initialState,
        ...defaultValues,
      }));
      setErrors({});
    }
  }, [open, defaultValues]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email.trim())) {
      newErrors.email = "Invalid email address";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit?.({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      resumeUrl: formValues.resumeUrl.trim(),
      coverLetter: formValues.coverLetter.trim(),
    });
  };

  const disabled = loading;

  const subtitle = useMemo(() => statusMessage(job), [job]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply to {job?.jobTitle || "this role"}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formValues.name}
                onChange={handleChange("name")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="Jane Smith"
                disabled={disabled}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formValues.email}
                onChange={handleChange("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="jane@example.com"
                disabled={disabled}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formValues.phone}
                onChange={handleChange("phone")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 890"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
              <input
                type="url"
                value={formValues.resumeUrl}
                onChange={handleChange("resumeUrl")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://drive.google.com/your-resume"
                disabled={disabled}
              />
              <p className="text-xs text-gray-500 mt-1">Share a link to your resume or portfolio.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              value={formValues.coverLetter}
              onChange={handleChange("coverLetter")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
              placeholder="Highlight your experience and interest in this role..."
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


