"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Briefcase,
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Download,
  Camera,
  Save,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    coverImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
    about:
      "Passionate full-stack developer with 5+ years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 80 },
      { name: "Python", level: 75 },
      { name: "AWS", level: 70 },
      { name: "MongoDB", level: 85 },
      { name: "Git", level: 90 },
    ],
    projects: [
      {
        title: "E-Commerce Platform",
        description:
          "Built a full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "github.com/johndoe/ecommerce",
      },
      {
        title: "Task Management App",
        description:
          "Developed a collaborative task management application with real-time updates and team collaboration features.",
        technologies: ["React", "Firebase", "Material-UI"],
        link: "github.com/johndoe/taskmanager",
      },
      {
        title: "Weather Dashboard",
        description:
          "Created an interactive weather dashboard with forecasts, maps, and historical data visualization.",
        technologies: ["React", "OpenWeather API", "Chart.js"],
        link: "github.com/johndoe/weather",
      },
    ],
    experience: [
      {
        position: "Senior Developer",
        company: "Tech Corp",
        duration: "2022 - Present",
        description: "Leading development of customer-facing web applications",
      },
      {
        position: "Full Stack Developer",
        company: "StartUp Inc",
        duration: "2019 - 2022",
        description: "Developed and maintained multiple client projects",
      },
    ],
  });

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...profileData.skills];
    newSkills[index][field] = value;
    setProfileData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...profileData.projects];
    newProjects[index][field] = value;
    setProfileData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);
  const handleSave = () => setIsEditing(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 relative">
          {/* Cover Image */}
          <div
            className="relative h-48 sm:h-56 cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
          >
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/10">
              <div className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 font-semibold">
                <Camera size={20} />
                Change Cover Photo
              </div>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageChange}
            />
          </div>

          <div className="px-6 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
              {/* Profile Picture */}
              <div
                className="relative cursor-pointer"
                onClick={() => profileInputRef.current?.click()}
              >
                <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  <img
                    src={profileData.profileImage}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-70 p-2 rounded-full">
                    <Camera className="text-gray-800" size={24} />
                  </div>
                </div>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="text-3xl font-bold text-gray-800 border-b-2 border-blue-300 focus:outline-none bg-transparent text-center md:text-left"
                    />
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="text-xl text-gray-600 mt-2 border-b border-blue-200 focus:outline-none bg-transparent text-center md:text-left"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {profileData.name}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      {profileData.title}
                    </p>
                  </>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <input
                          type="text"
                          value={profileData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="border-b border-blue-200 focus:outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="border-b border-blue-200 focus:outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            handleChange("location", e.target.value)
                          }
                          className="border-b border-blue-200 focus:outline-none bg-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Joined {profileData.joinDate}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons below profile info */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-6 w-full sm:w-auto z-10">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                <Download size={16} />
                Resume
              </button>

              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm ${
                  isEditing
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-300"
                }`}
              >
                {isEditing ? (
                  <>
                    <Save size={16} /> Save
                  </>
                ) : (
                  <>
                    <Edit2 size={16} /> Edit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">About</h2>
              </div>
              {isEditing ? (
                <textarea
                  value={profileData.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  className="w-full border border-blue-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-400"
                  rows="5"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Skills</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md group overflow-hidden"
                  >
                    <div className="relative z-10">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillChange(index, "name", e.target.value)
                            }
                            className="text-sm font-semibold text-gray-800 mb-2 border-b border-blue-200 focus:outline-none bg-transparent"
                          />
                          <input
                            type="number"
                            value={skill.level}
                            onChange={(e) =>
                              handleSkillChange(index, "level", e.target.value)
                            }
                            className="w-full text-xs font-bold text-blue-600 focus:outline-none border-b border-blue-200 bg-transparent"
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-semibold text-gray-800 mb-2">
                            {skill.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-blue-600">
                              {skill.level}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Experience</h2>
              </div>
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{exp.duration}</p>
                  <p className="text-gray-600 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
              </div>
              {profileData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          handleProjectChange(index, "title", e.target.value)
                        }
                        className="w-full text-lg font-semibold text-gray-800 border-b border-blue-200 focus:outline-none mb-2"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          handleProjectChange(index, "description", e.target.value)
                        }
                        className="w-full border border-blue-200 rounded-lg p-2 mb-2 focus:outline-none"
                        rows="3"
                      />
                      <input
                        type="text"
                        value={project.link}
                        onChange={(e) =>
                          handleProjectChange(index, "link", e.target.value)
                        }
                        className="w-full border-b border-blue-200 focus:outline-none text-sm text-blue-600 mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a
                        href={`https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Project →
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
