import React from 'react';
import NavBar from './NavBar';

interface ProtectedLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ onLogout, children }) => {
  return (
    <div className="flex h-screen bg-[#DEE5E5]">
      <NavBar onLogout={onLogout} />
      <div className="flex-1 m-8 relative">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
