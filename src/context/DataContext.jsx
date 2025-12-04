import React, { createContext, useContext, useState } from 'react';
import {
    initialContractors,
    organizations,
    users,
    requirementTemplates,
    complianceProjects,
    fileRecords,
    getProjectWithDetails,
    getFileRecordsByProjectId,
    getUserById
} from '../utils/mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // State for legacy compatibility
    const [contractors, setContractors] = useState(initialContractors);

    // State for new 5-table schema
    const [organizationsState, setOrganizationsState] = useState(organizations);
    const [usersState, setUsersState] = useState(users);
    const [templatesState, setTemplatesState] = useState(requirementTemplates);
    const [projectsState, setProjectsState] = useState(complianceProjects);
    const [fileRecordsState, setFileRecordsState] = useState(fileRecords);

    // ============================================================================
    // NEW DATA MODEL FUNCTIONS
    // ============================================================================

    /**
     * Approve a file record and sync project status
     * Atomic operations:
     * 1. Update FileRecord status to APPROVED
     * 2. Sync parent ComplianceProject status
     */
    const approveFileRecord = (fileRecordId, reviewerId) => {
        const timestamp = new Date().toLocaleString('en-AU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');

        // Update FileRecord
        setFileRecordsState(prevRecords => prevRecords.map(fr =>
            fr.id === fileRecordId
                ? {
                    ...fr,
                    status: 'APPROVED',
                    reviewedBy: reviewerId,
                    reviewedAt: timestamp,
                    feedback: 'Approved by MEGA admin.'
                }
                : fr
        ));

        // Sync parent ComplianceProject
        setProjectsState(prevProjects => prevProjects.map(project => {
            const fileRecord = fileRecordsState.find(fr => fr.id === fileRecordId);
            if (fileRecord && project.id === fileRecord.projectId) {
                return {
                    ...project,
                    status: 'APPROVED',
                    currentFileRecordId: fileRecordId,
                    rejectionReason: null,
                    updatedAt: timestamp.split(' ')[0]
                };
            }
            return project;
        }));

        // Update legacy contractors state
        regenerateLegacyData();
    };

    /**
     * Reject a file record with feedback and sync project status
     * Atomic operations:
     * 1. Update FileRecord with feedback
     * 2. Sync parent ComplianceProject status and rejectionReason
     */
    const rejectFileRecord = (fileRecordId, feedback, reviewerId) => {
        const timestamp = new Date().toLocaleString('en-AU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');

        // Update FileRecord
        setFileRecordsState(prevRecords => prevRecords.map(fr =>
            fr.id === fileRecordId
                ? {
                    ...fr,
                    status: 'REJECTED',
                    feedback: feedback,
                    reviewedBy: reviewerId,
                    reviewedAt: timestamp
                }
                : fr
        ));

        // Sync parent ComplianceProject
        setProjectsState(prevProjects => prevProjects.map(project => {
            const fileRecord = fileRecordsState.find(fr => fr.id === fileRecordId);
            if (fileRecord && project.id === fileRecord.projectId) {
                return {
                    ...project,
                    status: 'REJECTED',
                    currentFileRecordId: fileRecordId,
                    rejectionReason: feedback,
                    updatedAt: timestamp.split(' ')[0]
                };
            }
            return project;
        }));

        // Update legacy contractors state
        regenerateLegacyData();
    };

    /**
     * Add new file record and reset project status to PENDING_REVIEW
     * CRITICAL: This is called when contractor re-uploads after rejection
     */
    const addFileRecord = (projectId, uploadData) => {
        const timestamp = new Date().toLocaleString('en-AU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');

        // Generate new file record ID
        const newFileRecordId = `FR-${Date.now()}`;

        const newFileRecord = {
            id: newFileRecordId,
            projectId: projectId,
            uploadedBy: uploadData.uploadedBy,
            fileName: uploadData.file.name,
            fileUrl: `/mock/uploads/${uploadData.file.name}`,
            uploadDate: timestamp,
            notes: uploadData.notes || 'No notes provided',
            status: 'PENDING_REVIEW',
            feedback: null,
            reviewedBy: null,
            reviewedAt: null
        };

        // Add new FileRecord
        setFileRecordsState(prevRecords => [...prevRecords, newFileRecord]);

        // Reset parent ComplianceProject status to PENDING_REVIEW
        setProjectsState(prevProjects => prevProjects.map(project =>
            project.id === projectId
                ? {
                    ...project,
                    status: 'PENDING_REVIEW',
                    currentFileRecordId: newFileRecordId,
                    rejectionReason: null, // Clear old rejection
                    updatedAt: timestamp.split(' ')[0]
                }
                : project
        ));

        // Update legacy contractors state
        regenerateLegacyData();
    };

    /**
     * Get project with all related data (template, org, file history)
     */
    const getProjectDetails = (projectId) => {
        const project = projectsState.find(p => p.id === projectId);
        if (!project) return null;

        const template = templatesState.find(t => t.id === project.templateId);
        const organization = organizationsState.find(org => org.id === project.orgId);
        const fileHistory = fileRecordsState
            .filter(fr => fr.projectId === projectId)
            .map(fr => ({
                ...fr,
                uploadedByUser: usersState.find(u => u.id === fr.uploadedBy)
            }));

        return {
            ...project,
            template,
            organization,
            fileHistory
        };
    };

    // ============================================================================
    // LEGACY COMPATIBILITY FUNCTIONS (Keep existing components working)
    // ============================================================================

    /**
     * Regenerate legacy contractors array from new schema
     * Called after any data mutation to keep legacy data in sync
     */
    const regenerateLegacyData = () => {
        const updatedContractors = organizationsState
            .filter(org => org.type === 'CONTRACTOR')
            .map(org => {
                const orgProjects = projectsState.filter(p => p.orgId === org.id);
                const primaryUser = usersState.find(u => u.orgId === org.id);

                const complianceDocs = orgProjects
                    .filter(p => {
                        const template = templatesState.find(t => t.id === p.templateId);
                        return template?.type === 'COMPLIANCE';
                    })
                    .map(project => {
                        const template = templatesState.find(t => t.id === project.templateId);
                        const uploadHistory = fileRecordsState
                            .filter(fr => fr.projectId === project.id)
                            .map(fr => ({
                                uploadId: fr.id,
                                fileName: fr.fileName,
                                uploadDate: fr.uploadDate,
                                notes: fr.notes,
                                status: fr.status,
                                uploadedBy: usersState.find(u => u.id === fr.uploadedBy)?.fullName || 'Unknown'
                            }));

                        return {
                            id: project.id,
                            title: project.displayName || template?.title || 'Unknown',
                            type: 'Compliance',
                            status: project.status,
                            dueDate: project.dueDate,
                            uploadedDate: project.currentFileRecordId
                                ? fileRecordsState.find(fr => fr.id === project.currentFileRecordId)?.uploadDate.split(' ')[0]
                                : '-',
                            description: template?.description || '',
                            rejectionReason: project.rejectionReason,
                            uploadHistory: uploadHistory
                        };
                    });

                const reportingDocs = orgProjects
                    .filter(p => {
                        const template = templatesState.find(t => t.id === p.templateId);
                        return template?.type === 'REPORTING';
                    })
                    .map(project => {
                        const template = templatesState.find(t => t.id === project.templateId);
                        const uploadHistory = fileRecordsState
                            .filter(fr => fr.projectId === project.id)
                            .map(fr => ({
                                uploadId: fr.id,
                                fileName: fr.fileName,
                                uploadDate: fr.uploadDate,
                                notes: fr.notes,
                                status: fr.status,
                                uploadedBy: usersState.find(u => u.id === fr.uploadedBy)?.fullName || 'Unknown'
                            }));

                        return {
                            id: project.id,
                            title: project.displayName || template?.title || 'Unknown',
                            type: 'Reporting',
                            status: project.status,
                            dueDate: project.dueDate,
                            uploadedDate: project.currentFileRecordId
                                ? fileRecordsState.find(fr => fr.id === project.currentFileRecordId)?.uploadDate.split(' ')[0]
                                : '-',
                            description: template?.description || '',
                            rejectionReason: project.rejectionReason,
                            uploadHistory: uploadHistory
                        };
                    });

                const totalProjects = orgProjects.length;
                const approvedProjects = orgProjects.filter(p => p.status === 'APPROVED').length;
                const complianceRate = totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0;

                return {
                    id: org.id,
                    name: org.name,
                    status: org.status === 'ACTIVE' ? 'Active' : org.status === 'INACTIVE' ? 'Inactive' : 'Pending',
                    complianceRate: complianceRate,
                    lastUpload: org.lastActivity,
                    abn: org.abn,
                    address: org.address,
                    contactName: primaryUser?.fullName || 'Unknown',
                    contactEmail: primaryUser?.email || '',
                    services: org.services,
                    complianceDocs: complianceDocs,
                    reportingDocs: reportingDocs
                };
            });

        setContractors(updatedContractors);
    };

    const updateRequestStatus = (id, status) => {
        setContractors(prevContractors => prevContractors.map(contractor => {
            const complianceDocIndex = contractor.complianceDocs.findIndex(d => d.id === id);
            if (complianceDocIndex !== -1) {
                const newDocs = [...contractor.complianceDocs];
                newDocs[complianceDocIndex] = { ...newDocs[complianceDocIndex], status };
                return { ...contractor, complianceDocs: newDocs };
            }

            const reportingDocIndex = contractor.reportingDocs.findIndex(d => d.id === id);
            if (reportingDocIndex !== -1) {
                const newDocs = [...contractor.reportingDocs];
                newDocs[reportingDocIndex] = { ...newDocs[reportingDocIndex], status };
                return { ...contractor, reportingDocs: newDocs };
            }

            return contractor;
        }));
    };

    const addFileUpload = (moduleId, uploadData) => {
        // Find the project ID from moduleId (which is the project ID in new schema)
        const project = projectsState.find(p => p.id === moduleId);
        if (project) {
            addFileRecord(moduleId, uploadData);
        }
    };

    const addContractor = (contractor) => {
        setContractors([...contractors, contractor]);
    };

    return (
        <DataContext.Provider value={{
            // Legacy data (for components not yet migrated)
            contractors,
            updateRequestStatus,
            addFileUpload,
            addContractor,

            // New data model
            organizations: organizationsState,
            users: usersState,
            templates: templatesState,
            projects: projectsState,
            fileRecords: fileRecordsState,

            // New functions
            approveFileRecord,
            rejectFileRecord,
            addFileRecord,
            getProjectDetails
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
