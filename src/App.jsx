import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Management from './pages/Management';
import ContractorDetails from './pages/ContractorDetails';
import ComplianceRequest from './pages/ComplianceRequest';
import FileUploadPage from './pages/FileUploadPage';
import AdminFileRecordPage from './pages/AdminFileRecordPage';
import Archive from './pages/Archive';
import Account from './pages/Account';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/home" replace />} />
                        <Route path="home" element={<Home />} />
                        <Route path="management" element={user?.role === 'MEGA' ? <Management /> : <Navigate to="/home" />} />
                        <Route path="details/:id" element={user?.role === 'MEGA' ? <ContractorDetails /> : <Navigate to="/home" />} />
                        <Route path="admin/file-records" element={user?.role === 'MEGA' ? <AdminFileRecordPage /> : <Navigate to="/home" />} />
                        <Route path="request" element={user?.role !== 'MEGA' ? <ComplianceRequest /> : <Navigate to="/home" />} />
                        <Route path="upload" element={user?.role !== 'MEGA' ? <FileUploadPage /> : <Navigate to="/home" />} />
                        <Route path="archive" element={user?.role !== 'MEGA' ? <Archive /> : <Navigate to="/home" />} />
                        <Route path="account" element={<Account />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
