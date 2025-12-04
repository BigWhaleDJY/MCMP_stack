import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, CloudArrowUp, CheckCircle, Clock, WarningCircle, FileText, Calendar } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import FileUploadModal from '../components/FileUploadModal';

const FileUploadPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addFileUpload } = useData();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Get module data from navigation state
    const moduleData = location.state?.moduleData;

    // Redirect back if no module data
    if (!moduleData) {
        navigate('/request');
        return null;
    }

    const uploadHistory = moduleData.uploadHistory || [];

    const handleFileUpload = (uploadData) => {
        const newUpload = {
            uploadId: `${user.company.substring(0, 3).toUpperCase()}-${moduleData.id}-U${String(uploadHistory.length + 1).padStart(3, '0')}`,
            fileName: uploadData.file.name,
            uploadDate: new Date().toLocaleString('en-AU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(',', ''),
            notes: uploadData.notes || 'No notes provided',
            status: 'Pending Review',
            uploadedBy: user.name
        };

        addFileUpload(moduleData.id, newUpload);
        setIsUploadModalOpen(false);
        showToast('File uploaded successfully! Awaiting review.', 'success');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="text-green-600" />;
            case 'Rejected':
                return <WarningCircle className="text-red-600" />;
            case 'Pending Review':
                return <Clock className="text-blue-600" />;
            default:
                return <Clock className="text-slate-600" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700';
            case 'Rejected':
                return 'bg-red-100 text-red-700';
            case 'Pending Review':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto pb-20"
        >
            {/* Header Section */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/request')}
                    className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium mb-4 transition"
                >
                    <ArrowLeft /> Back to Compliance & Reporting
                </button>

                <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className={`text-2xl ${moduleData.type === 'Compliance' ? 'text-teal-600' : 'text-blue-600'}`} />
                                <h1 className="text-2xl font-bold text-slate-800">{moduleData.title}</h1>
                            </div>
                            <p className="text-slate-600 mb-3">{moduleData.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-slate-500">
                                    <Calendar /> Due: <span className="font-medium text-slate-700">{moduleData.dueDate}</span>
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(moduleData.status)} flex items-center gap-1`}>
                                    {getStatusIcon(moduleData.status)} {moduleData.status}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-teal-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-teal-700 shadow-lg flex items-center gap-2 transition"
                        >
                            <CloudArrowUp className="text-xl" /> Upload File
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload History Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-800">Upload History</h2>
                    <p className="text-sm text-slate-500">View all previous file submissions for this module</p>
                </div>

                {uploadHistory.length === 0 ? (
                    <div className="p-12 text-center">
                        <CloudArrowUp className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-600 mb-2">No Upload History</h3>
                        <p className="text-slate-500 mb-6">You haven't uploaded any files for this module yet.</p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-teal-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal-700 shadow-lg inline-flex items-center gap-2"
                        >
                            <CloudArrowUp /> Upload Your First File
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Upload Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Uploaded By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {uploadHistory.map((upload, index) => (
                                    <motion.tr
                                        key={upload.uploadId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-slate-400" />
                                                <span className="font-medium text-slate-800">{upload.fileName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{upload.uploadDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusClass(upload.status)}`}>
                                                {getStatusIcon(upload.status)} {upload.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={upload.notes}>
                                            {upload.notes}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{upload.uploadedBy}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <FileUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleFileUpload}
                moduleTitle={moduleData.title}
            />
        </motion.div>
    );
};

export default FileUploadPage;
