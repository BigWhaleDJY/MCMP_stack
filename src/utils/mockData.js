// ============================================================================
// NEW DATA ARCHITECTURE - 5-TABLE RELATIONAL SCHEMA
// ============================================================================
// This file implements a proper relational data structure to support:
// - Multi-tenant organization management (MEGA + Contractors)
// - Requirement template definitions (reusable across contractors)
// - Project instances (specific contractor tasks)
// - Complete file upload audit trail
// - User-organization relationships
// ============================================================================

// ===================
// TABLE 1: ORGANIZATIONS
// ===================
// Stores all company entities (MEGA regulator + contractor companies)
export const organizations = [
    {
        id: 1,
        type: 'REGULATOR',
        name: 'Mega Resources',
        abn: '11 111 111 111',
        address: '1 test Rd, Perth WA 6000',
        phone: '1300 0000',
        services: 'Mining Compliance Management',
        status: 'ACTIVE',
        createdAt: '2020-01-01',
        lastActivity: '2025-12-03'
    },
    {
        id: 101,
        type: 'CONTRACTOR',
        name: 'TWS',
        abn: '12 123 123 123',
        address: '1 test St, Perth WA 6000',
        phone: '0450 123 456',
        services: 'WHO, Safety Training',
        status: 'ACTIVE',
        createdAt: '2025-01-15',
        lastActivity: '2025-12-01'
    },
    {
        id: 102,
        type: 'CONTRACTOR',
        name: 'SalesForce',
        abn: '12 333 444 555',
        address: '2 test St, Perth WA 6000',
        phone: '0450 789 012',
        services: 'Drilling, Excavation',
        status: 'ACTIVE',
        createdAt: '2025-01-20',
        lastActivity: '2025-12-01'
    },
    {
        id: 103,
        type: 'CONTRACTOR',
        name: 'AWS',
        abn: '12 555 666 777',
        address: '3 test St, Perth WA 6000',
        phone: '0450 345 678',
        services: 'Cloud Computing',
        status: 'INACTIVE',
        createdAt: '2024-06-01',
        lastActivity: '2024-12-15'
    }
];

// ===================
// TABLE 2: USERS
// ===================
// Natural persons who can log into the system
export const users = [
    {
        id: 1,
        orgId: 1, // Mega Resources
        email: 'admin@admin.com.au',
        password: '123456',
        fullName: 'Mega Admin',
        role: 'MEGA_ADMIN',
        avatar: 'Mason',
        phone: '0450 123 456',
        isActive: true
    },
    {
        id: 2,
        orgId: 101, // TWS
        email: 'test1@tws.com.au',
        password: '123456',
        fullName: 'Jack Deng',
        role: 'CONTRACTOR_USER',
        avatar: 'Liam',
        phone: '0450 123 456',
        isActive: true
    },
    {
        id: 3,
        orgId: 102, // SalesForce
        email: 'test2@tws.com.au',
        password: '123456',
        fullName: 'Sarah Jones',
        role: 'CONTRACTOR_USER',
        avatar: 'Sarah',
        phone: '0450 123 456',
        isActive: true
    }
];

// ===================
// TABLE 3: REQUIREMENT TEMPLATES
// ===================
// Abstract compliance/reporting requirements defined by MEGA
export const requirementTemplates = [
    {
        id: 'TPL-PLI',
        type: 'COMPLIANCE',
        title: 'Public Liability Insurance',
        description: 'Please upload your renewed Public Liability Insurance certificate (min $20M).',
        frequency: 'ANNUAL',
        mandatoryForAll: true,
        createdAt: '2024-01-01'
    },
    {
        id: 'TPL-WHS',
        type: 'COMPLIANCE',
        title: 'WHS Management Plan',
        description: 'Operational Health and Safety Plan.',
        frequency: 'ANNUAL',
        mandatoryForAll: true,
        createdAt: '2024-01-01'
    },
    {
        id: 'TPL-WSR',
        type: 'REPORTING',
        title: 'Weekly Safety Report',
        description: 'Standard weekly reporting template. Please upload files.',
        frequency: 'WEEKLY',
        mandatoryForAll: true,
        createdAt: '2024-01-01'
    },
    {
        id: 'TPL-MEA',
        type: 'REPORTING',
        title: 'Monthly Environmental Audit',
        description: 'Monthly environmental impact assessment.',
        frequency: 'MONTHLY',
        mandatoryForAll: true,
        createdAt: '2024-01-01'
    }
];

// ===================
// TABLE 4: COMPLIANCE PROJECTS
// ===================
// Specific instances of requirements assigned to contractors
export const complianceProjects = [
    // TWS Projects
    {
        id: 'P-TWS-PLI-2025',
        templateId: 'TPL-PLI',
        orgId: 101, // TWS
        displayName: 'Public Liability Insurance',
        status: 'REJECTED',
        currentFileRecordId: 'FR-TWS-PLI-001',
        dueDate: '2025-11-01',
        createdAt: '2025-01-15',
        updatedAt: '2025-10-26',
        rejectionReason: 'The uploaded document expired in 2024. Please provide the current certificate.'
    },
    {
        id: 'P-TWS-WHS-2025',
        templateId: 'TPL-WHS',
        orgId: 101,
        displayName: 'WHS Management Plan',
        status: 'APPROVED',
        currentFileRecordId: 'FR-TWS-WHS-001',
        dueDate: '2025-11-01',
        createdAt: '2025-01-15',
        updatedAt: '2025-11-15',
        rejectionReason: null
    },
    {
        id: 'P-TWS-WSR-W42',
        templateId: 'TPL-WSR',
        orgId: 101,
        displayName: 'Weekly Safety Report - Week 42',
        status: 'APPROVED',
        currentFileRecordId: 'FR-TWS-WSR-W42-001',
        dueDate: '2025-10-27',
        createdAt: '2025-10-20',
        updatedAt: '2025-10-24',
        rejectionReason: null
    },
    {
        id: 'P-TWS-WSR-W43',
        templateId: 'TPL-WSR',
        orgId: 101,
        displayName: 'Weekly Safety Report - Week 43',
        status: 'PENDING',
        currentFileRecordId: null,
        dueDate: '2025-11-03',
        createdAt: '2025-10-27',
        updatedAt: '2025-10-27',
        rejectionReason: null
    },
    {
        id: 'P-TWS-MEA-NOV',
        templateId: 'TPL-MEA',
        orgId: 101,
        displayName: 'Monthly Environmental Audit - November',
        status: 'PENDING',
        currentFileRecordId: null,
        dueDate: '2025-12-01',
        createdAt: '2025-11-01',
        updatedAt: '2025-11-01',
        rejectionReason: null
    },

    // SalesForce Projects
    {
        id: 'P-SLS-PLI-2025',
        templateId: 'TPL-PLI',
        orgId: 102, // SalesForce
        displayName: 'Public Liability Insurance',
        status: 'PENDING_REVIEW',
        currentFileRecordId: 'FR-SLS-PLI-001',
        dueDate: '2025-11-30',
        createdAt: '2025-01-20',
        updatedAt: '2025-11-01',
        rejectionReason: null
    }
];

// ===================
// TABLE 5: FILE RECORDS
// ===================
// Individual file upload records (append-only audit trail)
export const fileRecords = [
    // TWS - Public Liability Insurance (Rejected, then re-uploaded & approved historically)
    {
        id: 'FR-TWS-PLI-002',
        projectId: 'P-TWS-PLI-2025',
        uploadedBy: 2, // Jack Deng
        fileName: 'PLI_Certificate_2023.pdf',
        fileUrl: '/mock/uploads/tws/PLI_Certificate_2023.pdf',
        uploadDate: '2025-09-15 10:20',
        notes: 'Previous year certificate',
        status: 'APPROVED',
        feedback: null,
        reviewedBy: 1,
        reviewedAt: '2025-09-16 09:30'
    },
    {
        id: 'FR-TWS-PLI-001',
        projectId: 'P-TWS-PLI-2025',
        uploadedBy: 2,
        fileName: 'PLI_Certificate_2024.pdf',
        fileUrl: '/mock/uploads/tws/PLI_Certificate_2024.pdf',
        uploadDate: '2025-10-25 14:32',
        notes: 'Public Liability Insurance certificate for 2024-2025',
        status: 'REJECTED',
        feedback: 'The uploaded document expired in 2024. Please provide the current certificate.',
        reviewedBy: 1,
        reviewedAt: '2025-10-26 09:15'
    },

    // TWS - WHS Management Plan (Approved)
    {
        id: 'FR-TWS-WHS-001',
        projectId: 'P-TWS-WHS-2025',
        uploadedBy: 2,
        fileName: 'WHS_Management_Plan_2025.pdf',
        fileUrl: '/mock/uploads/tws/WHS_Management_Plan_2025.pdf',
        uploadDate: '2025-11-15 09:45',
        notes: 'Updated WHS plan for 2025 operations',
        status: 'APPROVED',
        feedback: 'All safety procedures are comprehensive and approved.',
        reviewedBy: 1,
        reviewedAt: '2025-11-15 14:20'
    },

    // TWS - Weekly Safety Report Week 42 (Approved)
    {
        id: 'FR-TWS-WSR-W42-001',
        projectId: 'P-TWS-WSR-W42',
        uploadedBy: 2,
        fileName: 'Safety_Report_Week42.pdf',
        fileUrl: '/mock/uploads/tws/Safety_Report_Week42.pdf',
        uploadDate: '2025-10-24 16:15',
        notes: 'Weekly safety report - no incidents recorded',
        status: 'APPROVED',
        feedback: 'Report accepted. Good safety record.',
        reviewedBy: 1,
        reviewedAt: '2025-10-25 08:45'
    },

    // SalesForce - Public Liability Insurance (Pending Review)
    {
        id: 'FR-SLS-PLI-001',
        projectId: 'P-SLS-PLI-2025',
        uploadedBy: 3, // Sarah Jones
        fileName: 'PLI_Certificate_SalesForce_2025.pdf',
        fileUrl: '/mock/uploads/salesforce/PLI_Certificate_SalesForce_2025.pdf',
        uploadDate: '2025-11-01 11:30',
        notes: 'Public Liability Insurance for SalesForce',
        status: 'PENDING_REVIEW',
        feedback: null,
        reviewedBy: null,
        reviewedAt: null
    }
];

// ============================================================================
// LEGACY DATA STRUCTURE (Keep for backward compatibility during migration)
// ============================================================================
// These will be gradually phased out as components migrate to new schema

export const initialUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    password: u.password,
    name: u.fullName,
    role: u.role === 'MEGA_ADMIN' ? 'MEGA' : 'CONTRACTOR',
    company: organizations.find(org => org.id === u.orgId)?.name || '',
    avatar: u.avatar,
    phone: u.phone
}));

export const initialContractors = organizations
    .filter(org => org.type === 'CONTRACTOR')
    .map(org => {
        const orgProjects = complianceProjects.filter(p => p.orgId === org.id);
        const primaryUser = users.find(u => u.orgId === org.id);

        // Separate compliance and reporting projects
        const complianceDocs = orgProjects
            .filter(p => {
                const template = requirementTemplates.find(t => t.id === p.templateId);
                return template?.type === 'COMPLIANCE';
            })
            .map(project => {
                const template = requirementTemplates.find(t => t.id === project.templateId);
                const uploadHistory = fileRecords
                    .filter(fr => fr.projectId === project.id)
                    .map(fr => ({
                        uploadId: fr.id,
                        fileName: fr.fileName,
                        uploadDate: fr.uploadDate,
                        notes: fr.notes,
                        status: fr.status,
                        uploadedBy: users.find(u => u.id === fr.uploadedBy)?.fullName || 'Unknown'
                    }));

                return {
                    id: project.id,
                    title: project.displayName || template?.title || 'Unknown',
                    type: 'Compliance',
                    status: project.status,
                    dueDate: project.dueDate,
                    uploadedDate: project.currentFileRecordId
                        ? fileRecords.find(fr => fr.id === project.currentFileRecordId)?.uploadDate.split(' ')[0]
                        : '-',
                    description: template?.description || '',
                    rejectionReason: project.rejectionReason,
                    uploadHistory: uploadHistory
                };
            });

        const reportingDocs = orgProjects
            .filter(p => {
                const template = requirementTemplates.find(t => t.id === p.templateId);
                return template?.type === 'REPORTING';
            })
            .map(project => {
                const template = requirementTemplates.find(t => t.id === project.templateId);
                const uploadHistory = fileRecords
                    .filter(fr => fr.projectId === project.id)
                    .map(fr => ({
                        uploadId: fr.id,
                        fileName: fr.fileName,
                        uploadDate: fr.uploadDate,
                        notes: fr.notes,
                        status: fr.status,
                        uploadedBy: users.find(u => u.id === fr.uploadedBy)?.fullName || 'Unknown'
                    }));

                return {
                    id: project.id,
                    title: project.displayName || template?.title || 'Unknown',
                    type: 'Reporting',
                    status: project.status,
                    dueDate: project.dueDate,
                    uploadedDate: project.currentFileRecordId
                        ? fileRecords.find(fr => fr.id === project.currentFileRecordId)?.uploadDate.split(' ')[0]
                        : '-',
                    description: template?.description || '',
                    rejectionReason: project.rejectionReason,
                    uploadHistory: uploadHistory
                };
            });

        // Calculate compliance rate
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

// ============================================================================
// HELPER FUNCTIONS FOR DATA ACCESS
// ============================================================================

export const getOrganizationById = (id) => {
    return organizations.find(org => org.id === id);
};

export const getUsersByOrgId = (orgId) => {
    return users.filter(u => u.orgId === orgId);
};

export const getProjectsByOrgId = (orgId) => {
    return complianceProjects.filter(p => p.orgId === orgId);
};

export const getFileRecordsByProjectId = (projectId) => {
    return fileRecords.filter(fr => fr.projectId === projectId);
};

export const getTemplateById = (templateId) => {
    return requirementTemplates.find(t => t.id === templateId);
};

export const getProjectWithDetails = (projectId) => {
    const project = complianceProjects.find(p => p.id === projectId);
    if (!project) return null;

    const template = getTemplateById(project.templateId);
    const organization = getOrganizationById(project.orgId);
    const fileHistory = getFileRecordsByProjectId(projectId);

    return {
        ...project,
        template,
        organization,
        fileHistory
    };
};

export const getUserById = (userId) => {
    return users.find(u => u.id === userId);
};
