import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Save,
} from 'lucide-react';
const server = import.meta.env.VITE_SERVER_URL;

const UserProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState('')
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${server}/user/get-data`, {credentials: "include"});
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        console.log(userData[0]);
        setName(
          userData[0].full_name || userData[0].username
        );
        setId(userData[0].id)
        setEmail(userData[0].email || "");
        setRole(userData[0].role||undefined)
      } catch (err) {
        console.error("Error fetching user data:", err);
      } 
    };

    fetchUserData();
  }, []);
 

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${server}/user/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile.");
    }
  };
  

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${server}/user/change-password/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Password change failed");
      }

      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("There was an error changing your password.");
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Профиль</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Информация
            </h2>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Полное имя:
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
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
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Роль
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={role}
                    disabled
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm py-2 px-3 border text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Role cant be changed.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Поменять пароль
            </h2>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Текущий
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
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Новый
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
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Подтвердить новый пароль
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
                    Поменять пароль
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* User Stats and Activity Log */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Статистика пользователей
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Добавленные активы</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Сгенерированные репорты</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">обновления МОЛ</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Последний логин</span>
                <span className="font-medium">Сегодня, 08:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;




/*

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

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
*/