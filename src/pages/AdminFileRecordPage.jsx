import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, FileText, CheckCircle, Clock, WarningCircle, Download, Check, X, Calendar } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

const AdminFileRecordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getProjectDetails, approveFileRecord, rejectFileRecord } = useData();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedFileRecord, setSelectedFileRecord] = useState(null);
    const [rejectionFeedback, setRejectionFeedback] = useState('');

    // Get project data from navigation state
    const projectData = location.state?.projectData;

    // Redirect back if no project data
    if (!projectData) {
        navigate('/management');
        return null;
    }

    // Get full project details
    const projectDetails = getProjectDetails(projectData.id);
    const fileHistory = projectDetails?.fileHistory || [];

    const handleDownloadFile = (fileRecord) => {
        // Simulated download - in real app, would download from S3
        showToast(`Downloading ${fileRecord.fileName}...`, 'info');
        // In production: window.open(fileRecord.fileUrl, '_blank');
    };

    const handleApprove = (fileRecord) => {
        approveFileRecord(fileRecord.id, user.id);
        showToast(`File "${fileRecord.fileName}" has been approved!`, 'success');
    };

    const handleReject = (fileRecord) => {
        setSelectedFileRecord(fileRecord);
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = () => {
        if (!rejectionFeedback.trim()) {
            showToast('Please provide rejection feedback', 'error');
            return;
        }

        rejectFileRecord(selectedFileRecord.id, rejectionFeedback, user.id);
        showToast(`File "${selectedFileRecord.fileName}" has been rejected`, 'info');
        setIsRejectModalOpen(false);
        setSelectedFileRecord(null);
        setRejectionFeedback('');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="text-green-600" />;
            case 'REJECTED':
                return <WarningCircle className="text-red-600" />;
            case 'PENDING_REVIEW':
                return <Clock className="text-blue-600" />;
            default:
                return <Clock className="text-slate-600" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-700';
            case 'REJECTED':
                return 'bg-red-100 text-red-700';
            case 'PENDING_REVIEW':
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
                    onClick={() => navigate(`/details/${projectDetails?.organization?.id}`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium mb-4 transition"
                >
                    <ArrowLeft /> Back to Contractor Details
                </button>

                <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="text-2xl text-teal-600" />
                                <h1 className="text-2xl font-bold text-slate-800">{projectData.displayName || projectData.title}</h1>
                            </div>
                            <p className="text-slate-600 mb-3">{projectDetails?.template?.description}</p>
                            <div className="flex items-center gap-6 text-sm">
                                <span className="text-slate-500">
                                    <span className="font-bold">Contractor:</span> {projectDetails?.organization?.name}
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                    <Calendar /> Due: <span className="font-medium text-slate-700">{projectData.dueDate}</span>
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(projectData.status)} flex items-center gap-1`}>
                                    {getStatusIcon(projectData.status)} {projectData.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Upload History Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-800">File Upload History</h2>
                    <p className="text-sm text-slate-500">Review all file submissions for this requirement</p>
                </div>

                {fileHistory.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-600 mb-2">No Files Uploaded</h3>
                        <p className="text-slate-500">The contractor has not uploaded any files for this requirement yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Upload Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Uploaded By</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {fileHistory.map((fileRecord, index) => (
                                    <motion.tr
                                        key={fileRecord.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-slate-400" />
                                                <div>
                                                    <span className="font-medium text-slate-800 block">{fileRecord.fileName}</span>
                                                    {fileRecord.feedback && (
                                                        <span className="text-xs text-slate-500 italic">Feedback: {fileRecord.feedback}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{fileRecord.uploadDate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{fileRecord.uploadedByUser?.fullName || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusClass(fileRecord.status)}`}>
                                                {getStatusIcon(fileRecord.status)} {fileRecord.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={fileRecord.notes}>
                                            {fileRecord.notes}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDownloadFile(fileRecord)}
                                                    className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded transition"
                                                    title="Download File"
                                                >
                                                    <Download className="text-lg" />
                                                </button>
                                                {fileRecord.status === 'PENDING_REVIEW' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(fileRecord)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition flex items-center gap-1 text-sm font-medium"
                                                            title="Approve"
                                                        >
                                                            <Check className="text-lg" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(fileRecord)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition flex items-center gap-1 text-sm font-medium"
                                                            title="Reject"
                                                        >
                                                            <X className="text-lg" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            {isRejectModalOpen && (
                <Modal
                    isOpen={isRejectModalOpen}
                    onClose={() => {
                        setIsRejectModalOpen(false);
                        setSelectedFileRecord(null);
                        setRejectionFeedback('');
                    }}
                    title="Reject File Submission"
                    headerColor="bg-red-600"
                >
                    <div className="mb-6">
                        <p className="text-slate-700 mb-4">
                            You are rejecting: <span className="font-bold">{selectedFileRecord?.fileName}</span>
                        </p>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Rejection Reason <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={rejectionFeedback}
                            onChange={(e) => setRejectionFeedback(e.target.value)}
                            rows="5"
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                            placeholder="Explain why this file is being rejected (e.g., document expired, incorrect information, etc.)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            onClick={() => {
                                setIsRejectModalOpen(false);
                                setSelectedFileRecord(null);
                                setRejectionFeedback('');
                            }}
                            className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRejectSubmit}
                            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg flex items-center gap-2 transition"
                        >
                            <X /> Reject File
                        </button>
                    </div>
                </Modal>
            )}
        </motion.div>
    );
};

export default AdminFileRecordPage;
