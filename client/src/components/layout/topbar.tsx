import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="bg-white border-b border-neutral-border px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          src="https://cloudworkmates.com/wp-content/uploads/2025/03/Web-Main-Logo-1.png"
          alt="Workmates Logo"
          className="h-10 sm:h-12 w-auto object-contain"
        />

        {/* Desktop User Info */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-workmates-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
              NK
            </div>
            <div className="text-sm">
              <p className="font-medium">Niraj Kumar</p>
              <p className="text-text-secondary text-xs">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-2 border-t border-neutral-border pt-2">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-workmates-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
              NK
            </div>
            <div className="text-sm">
              <p className="font-medium">Niraj Kumar</p>
              <p className="text-text-secondary text-xs">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm w-full text-left"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
