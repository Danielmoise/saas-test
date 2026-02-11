
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  isAdmin?: boolean;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, isAdmin, onNavigate }) => {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">
                S
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SaaSMod</span>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Storefront
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Backend Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SaaSMod Modular Generator. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Layout;
