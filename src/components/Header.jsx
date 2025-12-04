import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, Users, FileText, Archive, User, SignOut } from '@phosphor-icons/react';
import clsx from 'clsx';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'home', label: 'Home', icon: House, path: '/home', show: true },
        { id: 'management', label: 'Management', icon: Users, path: '/management', show: user?.role === 'MEGA' },
        { id: 'request', label: 'Reporting', icon: FileText, path: '/request', show: user?.role !== 'MEGA' },
        { id: 'archive', label: 'Archive', icon: Archive, path: '/archive', show: user?.role !== 'MEGA' },
        { id: 'account', label: 'Account', icon: User, path: '/account', show: true },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm z-20 flex-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left: Logo and Nav */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                            <img src="/images/logo1.jpg" alt="MEGA Logo" className="h-10 w-auto" />
                        </div>
                        <nav className="hidden sm:ml-12 sm:flex sm:gap-10">
                            {navItems.filter(item => item.show).map(item => (
                                <a
                                    key={item.id}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                                    className={clsx(
                                        location.pathname.startsWith(item.path)
                                            ? 'border-teal-500 text-slate-900'
                                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors gap-2'
                                    )}
                                >
                                    <item.icon className="text-lg" />
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right: Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.role === 'MEGA' ? 'Mega Admin' : 'Partner'}</p>
                        </div>

                        <div
                            onClick={() => navigate('/account')}
                            className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all"
                            title="Go to Account Settings"
                        >
                            <img src={`https://api.dicebear.com/9.x/thumbs/svg?scale=80&seed=${user?.avatar}`} alt="Profile" />
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Sign Out"
                        >
                            <SignOut className="text-2xl" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
