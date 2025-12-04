import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ClipboardText, Hourglass, CheckCircle, WarningCircle, BellRinging, Clock, FileLock, ChartBar, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const ComplianceRequest = () => {
    const { contractors } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Find the current contractor based on the logged-in user's company
    const currentContractor = contractors.find(c => c.name === user.company);

    // If no contractor found (shouldn't happen for valid contractors), return empty arrays
    const complianceTasks = currentContractor ? currentContractor.complianceDocs : [];
    const reportingTasks = currentContractor ? currentContractor.reportingDocs : [];

    const handleTaskClick = (task) => {
        navigate('/upload', { state: { moduleData: task } });
    };


    const renderCard = (task) => {
        let statusClass = 'bg-slate-100 text-slate-600';
        let Icon = Hourglass;
        if (task.status === 'Approved') { statusClass = 'bg-green-100 text-green-700'; Icon = CheckCircle; }
        else if (task.status === 'Rejected') { statusClass = 'bg-red-100 text-red-700'; Icon = WarningCircle; }
        else if (task.status === 'Action Required') { statusClass = 'bg-yellow-100 text-yellow-700'; Icon = BellRinging; }
        else if (task.status === 'Pending Review') { statusClass = 'bg-blue-50 text-blue-700'; Icon = Clock; }

        return (
            <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:border-teal-500 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white via-white to-slate-50 rounded-bl-full -mr-4 -mt-4 z-0 transition-colors group-hover:to-teal-50"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:text-teal-600 transition-colors">
                            {task.type === 'Compliance' ? <FileLock className="text-xl" /> : <ChartBar className="text-xl" />}
                        </div>
                        <span className={`${statusClass} text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1`}>
                            <Icon /> {task.status}
                        </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base mb-1 pr-4">{task.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 h-8">{task.description}</p>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-400">
                        <span>Due: <span className="font-medium text-slate-600">{task.dueDate}</span></span>
                        <span className="text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            View Details <ArrowRight />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto pb-20"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Compliance & Reporting</h2>
                <p className="text-slate-500">Manage your mandatory compliance documents and recurring operational reports.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: Compliance */}
                <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                        <ShieldCheck className="text-teal-600 text-xl" />
                        <h3 className="font-bold text-slate-700 text-lg">Compliance Documents</h3>
                        <span className="ml-auto text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{complianceTasks.length} Items</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {complianceTasks.map(renderCard)}
                        {complianceTasks.length === 0 && <div className="text-center text-slate-400 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">No compliance tasks.</div>}
                    </div>
                </div>

                {/* Column 2: Reporting */}
                <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                        <ClipboardText className="text-blue-600 text-xl" />
                        <h3 className="font-bold text-slate-700 text-lg">Reporting Schedules</h3>
                        <span className="ml-auto text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{reportingTasks.length} Items</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {reportingTasks.map(renderCard)}
                        {reportingTasks.length === 0 && <div className="text-center text-slate-400 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">No active reporting tasks.</div>}
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default ComplianceRequest;

