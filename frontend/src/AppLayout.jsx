// CONSIST OF CONTENTS THAT WILL STAY FIXED FOR ENTIRETY OF APPLICATION

import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer'
import { useAuth } from './context/AuthContext';


export default function AppLayout() {
    
  const { showLogoutToast } = useAuth();

  return (
    <>
      <Navbar />
      <main className="p-0">
        {showLogoutToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in-out">
          ✅ Successfully logged out!
        </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
