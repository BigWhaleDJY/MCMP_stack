import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, FilePdf, ChartBar, CheckCircle, ChartLineUp } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const ContractorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { contractors } = useData();
    const c = contractors.find(x => x.id == id);

    if (!c) return <div className="p-8 text-center">Contractor not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto pb-20"
        >
            <div
                className="flex items-center gap-2 text-sm text-slate-500 mb-4 cursor-pointer hover:text-teal-600"
                onClick={() => navigate('/management')}
            >
                <ArrowLeft /> Back to Partner Management
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{c.name}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {c.status}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">ABN: {c.abn}</p>
                        <div className="mt-4 flex gap-6 text-sm">
                            <div><span className="text-slate-400 block text-xs uppercase font-bold">Contact</span> {c.contactName}</div>
                            <div><span className="text-slate-400 block text-xs uppercase font-bold">Email</span> {c.contactEmail}</div>
                            <div><span className="text-slate-400 block text-xs uppercase font-bold">Services</span> {c.services}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-teal-600">{c.complianceRate}%</div>
                        <div className="text-xs text-slate-400 uppercase">Compliance Score</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Documents */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle className="text-teal-600" /> Compliance Documents
                        </h3>
                        <button className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-50">
                            + Request New
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50/50 min-h-[200px]">
                        <p className="text-xs text-slate-500 mb-3">Mandatory documents for connection (e.g., Insurance, WHS).</p>
                        {c.complianceDocs.length > 0 ? c.complianceDocs.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => navigate('/admin/file-records', { state: { projectData: doc } })}
                                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg mb-2 hover:border-teal-500 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded text-slate-500"><FilePdf className="text-xl" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{doc.title}</p>
                                        <p className="text-xs text-slate-500">Uploaded: {doc.uploadedDate} • Exp: {doc.dueDate}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' : doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {doc.status}
                                </span>
                            </div>
                        )) : <div className="text-sm text-slate-400 italic p-4">No compliance documents found.</div>}
                    </div>
                </div>

                {/* Reporting */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <ChartLineUp className="text-blue-600" /> Reporting & Performance
                        </h3>
                        <button className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-50">
                            + Request New
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50/50 min-h-[200px]">
                        <p className="text-xs text-slate-500 mb-3">Recurring operational reports submitted by contractor.</p>
                        {c.reportingDocs.length > 0 ? c.reportingDocs.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => navigate('/admin/file-records', { state: { projectData: doc } })}
                                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg mb-2 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-50 rounded text-teal-600"><ChartBar className="text-xl" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{doc.title}</p>
                                        <p className="text-xs text-slate-500">Status: {doc.status}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' : doc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {doc.status}
                                </span>
                            </div>
                        )) : <div className="text-sm text-slate-400 italic p-4">No reports submitted yet.</div>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContractorDetails;
