import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main key={location.pathname} className="flex-grow animate-fade-in-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
