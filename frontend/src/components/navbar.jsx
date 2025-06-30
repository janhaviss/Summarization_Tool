import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-[#8e7ab5] text-white">
      <Link to="/" className="font-bold">Text Summarizer</Link>

      {isAuthenticated ? (
        <Menu as="div" className="relative">
          <MenuButton className="rounded-full bg-white text-black px-4 py-1">User</MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow">
            <MenuItem><Link to="/profile" className="block px-4 py-2">Profile</Link></MenuItem>
            <MenuItem><Link to="/dashboard" className="block px-4 py-2">Dashboard</Link></MenuItem>
            <MenuItem><Link to="/settings" className="block px-4 py-2">Settings</Link></MenuItem>
            <MenuItem>
              <button onClick={logout} className="block w-full text-left px-4 py-2">Logout</button>
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
      )}
    </nav>
  );
}
