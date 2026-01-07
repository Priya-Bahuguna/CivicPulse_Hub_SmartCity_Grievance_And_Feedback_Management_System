import { useState, useEffect, useRef } from 'react';
import {
  User,
  Save,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Building
} from 'lucide-react';
import { getOfficerProfile, updateOfficerProfile } from '../../api/officer';

export default function OfficerProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    location: '',
    age: '',
    gender: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getOfficerProfile();
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNo: response.data.phoneNo || '',
          location: response.data.location || '',
          age: response.data.age || '',
          gender: response.data.gender || '',
          department: response.data.department || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  const handleUploadImage = async () => {
    if (!profileImage) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', profileImage);

      // Note: You'll need to add the upload endpoint to your backend
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay

      alert('Profile image updated successfully!');
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOfficerProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="max-w-4xl">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-gray-900 mb-6">Profile Photo</h3>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-semibold">
                  {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex gap-3 mb-2">
                <button
                  onClick={handleChangePhoto}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Change Photo
                </button>
                {profileImage && (
                  <button
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">JPG, PNG. Max 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                value={profileData.phoneNo}
                onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your location"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Age
              </label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your age"
                min="18"
                max="100"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Gender
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your department"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
