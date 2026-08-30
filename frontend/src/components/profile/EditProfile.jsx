import { useForm } from 'react-hook-form';
import { updateProfile } from '../../services/user.service';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Edit2, X, Check } from 'lucide-react';

export default function EditProfile({ user }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const { setUser, refreshUser } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: user.fullName,
      village: user.village || '',
      district: user.district || '',
      state: user.state || '',
      cropsGrown: user.cropsGrown?.join(', ') || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const cropsArray = data.cropsGrown.split(',').map(s => s.trim()).filter(Boolean);
      const response = await updateProfile({ ...data, cropsGrown: cropsArray });

      // Update user context immediately if response contains user data
      if (response.user) {
        setUser(response.user);
      } else {
        // Fallback: refresh user data from server
        await refreshUser();
      }

      setMessage('Profile updated successfully');
      setIsEditMode(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Update failed');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
    setMessage('');
  };

  // View Mode
  if (!isEditMode) {
    return (
      <div className="space-y-6 mt-4">
        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
            <p className="text-lg font-medium text-gray-900">{user?.fullName || 'Not provided'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Phone Number</label>
            <p className="text-lg font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Village</label>
            <p className="text-lg font-medium text-gray-900">{user?.village || 'Not provided'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">District</label>
            <p className="text-lg font-medium text-gray-900">{user?.district || 'Not provided'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">State</label>
            <p className="text-lg font-medium text-gray-900">{user?.state || 'Not provided'}</p>
          </div>
        </div>

        {/* Crops Grown */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Crops Grown</label>
          <div className="flex flex-wrap gap-2">
            {user?.cropsGrown && user.cropsGrown.length > 0 ? (
              user.cropsGrown.map((crop, index) => (
                <span key={index} className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {crop}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No crops specified</p>
            )}
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsEditMode(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <Edit2 size={18} />
          Edit Profile
        </button>
      </div>
    );
  }

  // Edit Mode
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
        <input
          {...register('fullName', { required: 'Full name is required' })}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors"
          placeholder="Enter full name"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Village</label>
        <input
          {...register('village')}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors"
          placeholder="Enter village name"
        />
        {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
        <input
          {...register('district')}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors"
          placeholder="Enter district"
        />
        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
        <input
          {...register('state')}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors"
          placeholder="Enter state"
        />
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Crops Grown (comma separated)</label>
        <input
          {...register('cropsGrown')}
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors"
          placeholder="e.g., Rice, Wheat, Corn"
        />
        {errors.cropsGrown && <p className="text-red-500 text-xs mt-1">{errors.cropsGrown.message}</p>}
        <p className="text-gray-500 text-xs mt-1">Enter multiple crops separated by commas</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <Check size={18} />
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
}