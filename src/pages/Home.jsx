import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Buildings, FileText } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isMega = user.role === 'MEGA';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            <div className="text-center mb-10 mt-4">
                <img src="/images/logo2.jpg" alt="Welcome Logo" className="mx-auto h-32 w-auto mb-4 rounded-lg shadow-sm" />
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back, {user.name}</h2>
                <p className="text-slate-500 mt-2">Mega Compliance Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/account')}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            {isMega ? <Users className="text-2xl" /> : <Buildings className="text-2xl" />}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {isMega ? 'Active' : 'Connected'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{isMega ? 'Mega Profile' : 'My Company Profile'}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        {isMega ? 'View Mega Admin Account' : 'View your company details and ABN.'}
                    </p>
                </div>

                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(isMega ? '/management' : '/request')}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <FileText className="text-2xl" />
                        </div>
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {isMega ? '12 Active' : 'Action Needed'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{isMega ? 'Management' : 'Reporting'}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        {isMega ? 'Manage partners, access, and compliance status.' : 'Submit compliance docs and weekly reports.'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
