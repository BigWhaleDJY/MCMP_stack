import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <div className="text-slate-800 h-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
            <Header />
            <main className="flex-1 overflow-y-auto p-6" id="main-container">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
