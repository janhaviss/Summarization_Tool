// CONSIST OF CONTENTS THAT WILL STAY FIXED FOR ENTIRETY OF APPLICATION

import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer'


export default function AppLayout() {
    

  return (
    <>
      <Navbar />
      <main className="p-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
