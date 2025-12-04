import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, EnvelopeSimple, Phone, Buildings, MapPin, LockKey, SignOut, CaretRight, PencilSimple } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Account = () => {
    const { user, logout, updateUser } = useAuth();
    const { contractors, organizations } = useData();
    // TODO: BACKEND - In a real app, we might fetch specific contractor details here based on the user's company ID
    // const { data: contractor } = useQuery(['contractor', user.companyId], fetchContractor);

    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email || '', // Ensure email is available in user object or handle gracefully
        phone: user.phone || '' // Get phone from user object
    });

    // Get user's organization details from the organizations table
    const userOrganization = organizations.find(org => org.name === user.company);

    let details = {};
    if (user.role === 'CONTRACTOR') {
        const contractor = contractors.find(c => c.name === user.company);
        details = {
            abn: contractor?.abn || userOrganization?.abn || 'N/A',
            address: contractor?.address || userOrganization?.address || 'N/A',
            email: user.email,
            phone: user.phone || formData.phone,
            roleDisplay: 'Contractor Profile'
        };
    } else {
        // MEGA Admin - get details from organizations table
        details = {
            abn: userOrganization?.abn || 'N/A',
            address: userOrganization?.address || 'N/A',
            email: user.email,
            phone: user.phone || formData.phone,
            roleDisplay: 'Mega Administrator'
        };
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        });
        setIsEditModalOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto pb-20"
        >
            {/* Header Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-blue-600"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto mb-4 bg-white flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/9.x/thumbs/svg?scale=80&seed=${user.avatar}`} alt="Avatar" className="w-full h-full" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                    <p className="text-slate-500 font-medium">{details.roleDisplay}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="text-teal-600" /> Personal Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                            <div className="text-slate-700 font-medium">{user.name}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
                            <div className="text-slate-700 font-medium flex items-center gap-2">
                                <EnvelopeSimple className="text-slate-400" /> {details.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                            <div className="text-slate-700 font-medium flex items-center gap-2">
                                <Phone className="text-slate-400" /> {details.phone}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Buildings className="text-blue-600" /> Company Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Name</label>
                            <div className="text-slate-700 font-bold text-lg">{user.company}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ABN</label>
                            <div className="text-slate-700 font-medium font-mono bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
                                {details.abn}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Address</label>
                            <div className="text-slate-700 font-medium flex items-start gap-2">
                                <MapPin className="text-slate-400 mt-0.5" /> {details.address}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings / Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div
                    className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center group"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition">
                            <PencilSimple className="text-xl" />
                        </div>
                        <div>
                            <div className="font-medium text-slate-800">Change Account Information</div>
                            <div className="text-xs text-slate-500">Update your personal details</div>
                        </div>
                    </div>
                    <CaretRight className="text-slate-400" />
                </div>

                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition">
                            <LockKey className="text-xl" />
                        </div>
                        <div>
                            <div className="font-medium text-slate-800">Change Password</div>
                            <div className="text-xs text-slate-500">Update your security credentials</div>
                        </div>
                    </div>
                    <CaretRight className="text-slate-400" />
                </div>

                <div
                    className="p-4 hover:bg-slate-50 cursor-pointer transition flex justify-between items-center group"
                    onClick={handleLogout}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-red-50 group-hover:text-red-600 transition">
                            <SignOut className="text-xl" />
                        </div>
                        <div className="text-red-600 font-medium">Log Out</div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Account Information"
                headerColor="bg-teal-600"
            >
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-teal-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default Account;
