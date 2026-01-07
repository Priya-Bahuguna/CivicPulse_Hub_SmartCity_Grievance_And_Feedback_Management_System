import { useState, useEffect, useRef } from 'react';
import {
  User,
  Save,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users
} from 'lucide-react';
import axios from 'axios';

export default function CitizenProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    age: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/citizen/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phoneNo: data.phoneNo || '',
        address: data.address || '',
        age: data.age ? data.age.toString() : '',
        gender: data.gender || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      const token = localStorage.getItem('token');
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
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...profileData,
        age: profileData.age ? parseInt(profileData.age) : null
      };

      await axios.put('http://localhost:8081/api/citizen/profile', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="max-w-4xl">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-gray-900 mb-6">Profile Photo</h3>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-200">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                onClick={handleChangePhoto}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mb-2"
              >
                Change Photo
              </button>
              {profileImage && (
                <button
                  onClick={handleUploadImage}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors mb-2 ml-2 disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                </button>
              )}
              <p className="text-xs text-gray-500">JPG, PNG. Max 5MB</p>
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
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Email cannot be changed"
              />
            </div>

            {/* Mobile No */}
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
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
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
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
