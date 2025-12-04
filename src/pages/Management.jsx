import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

const Management = () => {
    const { contractors } = useData();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Partner Management</h2>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700 shadow-md transition-transform active:scale-95"
                >
                    <Plus className="text-lg" /> Invite New Contractor
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Compliance</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {contractors.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900">{c.name}</div>
                                            <div className="text-xs text-slate-500">ID: *{c.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 w-24">
                                        <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${c.complianceRate}%` }}></div>
                                    </div>
                                    <span className="text-xs text-slate-500 mt-1 block">{c.complianceRate}% Compliant</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        className="text-teal-600 hover:text-teal-900 border border-teal-200 px-3 py-1 rounded hover:bg-teal-50 transition"
                                        onClick={() => navigate(`/details/${c.id}`)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Invite New Contractor"
            >
                <p className="text-slate-500 mb-6 text-sm">Please populate the following information to send an invitation email to the partner.</p>
                <form onSubmit={(e) => { e.preventDefault(); setIsInviteModalOpen(false); showToast('Invitation email sent successfully!', 'success'); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                            <input type="text" required className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-slate-900 focus:border-slate-900 p-2.5 border bg-slate-50" placeholder="e.g. BAAZ Transport" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">ABN</label>
                            <input type="text" required className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-slate-900 focus:border-slate-900 p-2.5 border bg-slate-50" placeholder="XX XXX XXX XXX" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Company Address</label>
                        <input type="text" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-slate-900 focus:border-slate-900 p-2.5 border bg-slate-50" placeholder="Full business address" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Service Provided</label>
                        <textarea className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-slate-900 focus:border-slate-900 p-2.5 border bg-slate-50" rows="3" placeholder="Description of services provided..."></textarea>
                    </div>

                    <div className="border-t border-slate-100 my-6"></div>

                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase mb-3">Key Contact Person</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" placeholder="Name" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm" />
                            <input type="text" placeholder="Telephone" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm" />
                            <input type="email" required placeholder="Email (Invitation sent here)" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm border-l-4 border-l-teal-500" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase mb-3">Key Account Person</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" placeholder="Name" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm" />
                            <input type="text" placeholder="Telephone" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm" />
                            <input type="email" placeholder="Email" className="border-slate-300 rounded-lg p-2.5 border bg-slate-50 text-sm" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button type="submit" className="bg-slate-900 text-white text-lg font-bold px-10 py-3 rounded-xl hover:bg-slate-800 shadow-lg transform transition hover:-translate-y-1 flex items-center gap-2">
                            GO <ArrowRight />
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default Management;
