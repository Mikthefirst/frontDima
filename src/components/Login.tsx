import React, { useState } from "react";
import { User, Lock } from "lucide-react";


interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
        credentials:'include'
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Если успешный логин
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
      }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#2A5F7F] py-4">
          <h2 className="text-center text-2xl font-bold text-white">
            Asset Management System
          </h2>
          <p className="text-center text-white text-sm">
            College Administration
          </p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                  placeholder="Enter your username or email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a href="#" className="text-sm text-[#2A5F7F] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            {/* Добавляем отображение ошибки */}
            {error && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Модифицируем кнопку для отображения состояния загрузки */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2A5F7F] text-white py-2 px-4 rounded-md hover:bg-[#1e4b63] focus:outline-none focus:ring-2 focus:ring-[#2A5F7F] focus:ring-opacity-50 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={onRegister}
                  className="text-[#2A5F7F] hover:text-[#1e4b63] font-medium"
                >
                  Register now
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
