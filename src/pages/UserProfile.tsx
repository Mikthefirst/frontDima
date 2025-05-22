import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Save,
  Clock
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

const UserProfile: React.FC = () => {


  const [name, setName] = useState('John Smith');
  const [email, setEmail] = useState('john.smith@college.edu');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /*useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("app/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();

        setName(userData.name || "");
        setEmail(userData.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
      } 
    };

    fetchUserData();
  }, []);*/
  // Sample data
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      action: 'Added Asset',
      timestamp: '2024-05-15 09:32:45',
      details: 'Added Asset #01360776 (Dell XPS 15 Laptop)'
    },
    {
      id: '2',
      action: 'Generated Report',
      timestamp: '2024-05-14 14:15:22',
      details: 'Generated Q2 Asset Summary Report'
    },
    {
      id: '3',
      action: 'Updated MBP',
      timestamp: '2024-05-13 11:05:37',
      details: 'Added 50 Notebooks to inventory'
    },
    {
      id: '4',
      action: 'Transferred Asset',
      timestamp: '2024-05-12 16:48:19',
      details: 'Transferred Projector from Room 101 to Room 203'
    },
    {
      id: '5',
      action: 'Updated Profile',
      timestamp: '2024-05-10 10:22:05',
      details: 'Changed email address'
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile changes
    alert('Profile updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would change the password
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    value="Asset Manager"
                    disabled
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm py-2 px-3 border text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Role changes can only be made by an administrator.</p>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* User Stats and Activity Log */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Assets Added</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reports Generated</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MBP Updates</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Login</span>
                <span className="font-medium">Today, 08:45 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Log</h2>
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-[#2A5F7F] hover:text-[#1e4b63] font-medium">
                View Full Activity History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;