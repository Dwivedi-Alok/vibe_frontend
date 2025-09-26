import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, Loader2, Calendar, Shield, Edit3 } from 'lucide-react';

function ProfilePage() {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result); // preview
    };

    try {
      const formData = new FormData();
      formData.append("avatar", file); // must match backend 'upload.single("avatar")'

      // Call your Zustand store action
      await updateProfile(formData); // updateProfile should handle axios.post with multipart/form-data
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 pt-20'>
      <div className='max-w-4xl mx-auto p-4 py-8'>
        {/* Header Card */}
        <div className='bg-base-100 rounded-2xl shadow-xl border border-base-300 mb-6'>
          <div className='bg-gradient-to-r from-primary to-secondary rounded-t-2xl p-6 pb-20'>
            <div className='text-center text-primary-content'>
              <h1 className='text-3xl font-bold mb-2'>My Profile</h1>
              <p className='text-primary-content/80'>Manage your account settings and preferences</p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className='flex flex-col items-center -mt-16 pb-6'>
            <div className='relative'>
              <div className='avatar'>
                <div className='w-32 h-32 rounded-full ring-4 ring-base-100 ring-offset-4 ring-offset-primary/20'>
                  <img
                    src={
                      selectedImg ||
                      authUser?.profilePic ||
                      (authUser?.gender === "male" ? "/avatar.png" : "/avatar2.png")
                    }
                    alt="Profile"
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Loading overlay */}
              {isUpdatingProfile && (
                <div className="absolute inset-0 flex flex-col items-center justify-center 
                                bg-black/60 rounded-full backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                  <span className="text-white text-xs font-medium">Uploading...</span>
                </div>
              )}

              {/* Camera button */}
              <label 
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2
                  btn btn-primary btn-circle btn-sm shadow-lg
                  hover:scale-110 transition-all duration-200
                  ${isUpdatingProfile ? "loading" : ""}
                `}
              >
                <Camera className='w-4 h-4' />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <div className='mt-4 text-center'>
              <h2 className='text-xl font-semibold text-base-content'>{authUser?.fullName}</h2>
              <p className='text-sm text-base-content/60 mt-1'>
                {isUpdatingProfile ? "Updating profile picture..." : "Click the camera icon to update your photo"}
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Personal Information */}
          <div className='bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <User className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h3 className='text-lg font-semibold'>Personal Information</h3>
                <p className='text-sm text-base-content/60'>Your basic account details</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text flex items-center gap-2'>
                    <User className='w-4 h-4' />
                    Full Name
                  </span>
                </label>
                <div className='input input-bordered flex items-center gap-3 bg-base-200'>
                  <span className='text-base-content'>{authUser?.fullName}</span>
                </div>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text flex items-center gap-2'>
                    <Mail className='w-4 h-4' />
                    Email Address
                  </span>
                </label>
                <div className='input input-bordered flex items-center gap-3 bg-base-200'>
                  <span className='text-base-content'>{authUser?.email}</span>
                </div>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text flex items-center gap-2'>
                    <User className='w-4 h-4' />
                    Gender
                  </span>
                </label>
                <div className='input input-bordered flex items-center gap-3 bg-base-200'>
                  <span className='text-base-content capitalize'>{authUser?.gender}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className='bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-info/10 rounded-lg'>
                <Shield className='w-5 h-5 text-info' />
              </div>
              <div>
                <h3 className='text-lg font-semibold'>Account Information</h3>
                <p className='text-sm text-base-content/60'>Account status and details</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-base-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Calendar className='w-4 h-4 text-base-content/60' />
                  <span className='font-medium'>Member Since</span>
                </div>
                <span className='text-sm text-base-content/80'>
                  {authUser?.createdAt ? formatDate(authUser.createdAt) : 'N/A'}
                </span>
              </div>

              <div className='flex items-center justify-between p-4 bg-base-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <Shield className='w-4 h-4 text-base-content/60' />
                  <span className='font-medium'>Account Status</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className={`w-2 h-2 rounded-full ${
                    authUser?.isActive ? 'bg-success' : 'bg-error'
                  }`}></div>
                  <span className={`text-sm font-semibold ${
                    authUser?.isActive ? 'text-success' : 'text-error'
                  }`}>
                    {authUser?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between p-4 bg-base-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <User className='w-4 h-4 text-base-content/60' />
                  <span className='font-medium'>User ID</span>
                </div>
                <span className='text-sm text-base-content/80 font-mono'>
                  {authUser?._id?.slice(-8) || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Card */}
        <div className='mt-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-base-300 p-6'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold mb-2'>Profile Completion</h3>
            <div className='flex justify-center mb-4'>
              <div className="radial-progress text-primary" style={{"--value": 85, "--size": "4rem"}}>
                85%
              </div>
            </div>
            <p className='text-sm text-base-content/60 max-w-md mx-auto'>
              Your profile is looking great! Consider adding more information to help others connect with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;