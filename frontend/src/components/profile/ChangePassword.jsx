import { useState } from 'react';
import { changePassword } from '../../services/user.service';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [formData, setFormData] = useState({ 
    oldPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All fields are required');
      setMessageType('error');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New password and confirm password do not match');
      setMessageType('error');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage('New password must be different from current password');
      setMessageType('error');
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(formData.oldPassword, formData.newPassword);
      setMessage('Password changed successfully');
      setMessageType('success');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ oldPassword: false, newPassword: false, confirmPassword: false });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4 max-w-md">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
        <div className="relative">
          <input
            type={showPasswords.oldPassword ? 'text' : 'password'}
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors pr-10"
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('oldPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            {showPasswords.oldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
        <div className="relative">
          <input
            type={showPasswords.newPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors pr-10"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
        <div className="relative">
          <input
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary-500 focus:outline-none transition-colors pr-10"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>
  );
}
