import { LogOut, MessageSquare, Settings, User, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className='bg-base-100/95 border-b border-base-300 fixed w-full top-0 z-50 backdrop-blur-lg shadow-sm'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          {/* Left Section - Logo */}
          <Link 
            to="/" 
            className='flex items-center gap-3 hover:opacity-80 transition-all duration-200 group'
          >
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200'>
              <MessageSquare className='w-5 h-5 text-white' />
            </div>
            <div className='hidden sm:block'>
              <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Vibe
              </h1>
              <p className='text-xs text-base-content/60 -mt-1'>Chat App</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-2'>
            <Link 
              to="/settings" 
              className={`btn btn-sm gap-2 transition-all duration-200 ${
                isActivePath('/settings') 
                  ? 'btn-primary shadow-lg' 
                  : 'btn-ghost hover:bg-base-200'
              }`}
            >
              <Settings className='w-4 h-4' />
              <span>Settings</span>
            </Link>

            {authUser && (
              <>
                <Link 
                  to="/profile" 
                  className={`btn btn-sm gap-2 transition-all duration-200 ${
                    isActivePath('/profile') 
                      ? 'btn-primary shadow-lg' 
                      : 'btn-ghost hover:bg-base-200'
                  }`}
                >
                  <User className='w-4 h-4' />
                  <span>Profile</span>
                </Link>

                <div className="divider divider-horizontal mx-2"></div>

                {/* User Info */}
                <div className='flex items-center gap-3 px-3 py-2 rounded-lg bg-base-200/50'>
                  <div className='avatar'>
                    <div className='w-8 h-8 rounded-full ring-2 ring-primary/20'>
                      <img 
                        src={authUser?.profilePic || (authUser?.gender === "male" ? "/avatar.png" : "/avatar2.png")} 
                        alt="Profile"
                        className='rounded-full object-cover'
                      />
                    </div>
                  </div>
                  <div className='hidden lg:block'>
                    <p className='text-sm font-medium text-base-content'>{authUser?.fullName}</p>
                    <p className='text-xs text-base-content/60'>Online</p>
                  </div>
                </div>

                <button 
                  onClick={handleLogout} 
                  className='btn btn-sm btn-error btn-outline gap-2 hover:btn-error transition-all duration-200'
                >
                  <LogOut className='w-4 h-4' />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button 
              onClick={toggleMobileMenu}
              className='btn btn-sm btn-ghost btn-square'
            >
              {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-base-300 bg-base-100/95 backdrop-blur-lg'>
            <div className='container mx-auto px-4 py-4 space-y-3'>
              {authUser && (
                <div className='flex items-center gap-3 p-3 bg-base-200/50 rounded-lg mb-4'>
                  <div className='avatar'>
                    <div className='w-10 h-10 rounded-full ring-2 ring-primary/20'>
                      <img 
                        src={authUser?.profilePic || (authUser?.gender === "male" ? "/avatar.png" : "/avatar2.png")} 
                        alt="Profile"
                        className='rounded-full object-cover'
                      />
                    </div>
                  </div>
                  <div>
                    <p className='font-medium text-base-content'>{authUser?.fullName}</p>
                    <p className='text-sm text-base-content/60'>{authUser?.email}</p>
                  </div>
                </div>
              )}

              <Link 
                to="/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActivePath('/settings') 
                    ? 'bg-primary text-primary-content' 
                    : 'hover:bg-base-200'
                }`}
              >
                <Settings className='w-5 h-5' />
                <span>Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActivePath('/profile') 
                        ? 'bg-primary text-primary-content' 
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <User className='w-5 h-5' />
                    <span>Profile</span>
                  </Link>

                  <hr className='border-base-300 my-2' />

                  <button 
                    onClick={handleLogout}
                    className='flex items-center gap-3 p-3 rounded-lg text-error hover:bg-error/10 transition-colors w-full'
                  >
                    <LogOut className='w-5 h-5' />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;