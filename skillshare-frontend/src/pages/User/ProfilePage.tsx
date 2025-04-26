import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { User, CreateUserRequest } from "../../types/user-types";
import UploadFileService from "../../services/uploadFileService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editForm, setEditForm] = useState<CreateUserRequest | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          if (!currentUserId) {
            navigate('/login');
            return;
          }
          const userData = await userApi.getUserById(currentUserId);
          setUser(userData);
          setEditForm(userData as unknown as CreateUserRequest);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };
    fetchUserProfile();
  }, [currentUserId,navigate]);


  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await UploadFileService.uploadFile(
        file,
        'profile-images',
        (progress) => setUploadProgress(Math.round(progress))
      );

      if (editForm) {
        setEditForm({ ...editForm, profileImageUrl: result.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (editForm) {
      setEditForm({
        ...editForm,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!editForm || !currentUserId) return;

    try {
      setIsLoading(true);
      const updatedUser = await userApi.updateUser(currentUserId, editForm);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUserId) return;

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userApi.deleteUser(currentUserId);
        handleLogout();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  if (!user || !editForm) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <div className="space-x-4 flex">
            <button
              onClick={() => setIsEditing(!isEditing)}
               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
               className="w-full flex justify-center py-3 px-4 border border-purple-200 rounded-xl shadow-md text-sm font-medium text-gray-700 bg-red-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="relative">
              <img
                src={user.profileImageUrl || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-48 object-cover rounded-lg"
              />
              {isEditing && (
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                  >
                    Change Photo
                  </label>
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={editForm.contactNumber}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 gap-12">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all ${
                        isLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleDelete}
                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Bio</h3>
                  <p className="text-gray-700">{user.bio || 'No bio added yet'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Contact</h3>
                  <p className="text-gray-700">{user.contactNumber || 'No contact number added'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;