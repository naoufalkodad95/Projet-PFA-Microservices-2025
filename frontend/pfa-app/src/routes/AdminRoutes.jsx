import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import MatchPlanning from '../pages/Admin/MatchPlanning';
import ResultsEntry from "../pages/Admin/ResultsEntry";

const AdminRoutes = () => {
  return (
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/matches" element={<MatchPlanning />} />
          {/* D'autres routes seront ajoutées plus tard */}
          <Route path="/results" element={<ResultsEntry />} />
          <Route path="/teams" element={<div>Gestion des équipes (à implémenter)</div>} />
          <Route path="/fields" element={<div>Gestion des terrains (à implémenter)</div>} />
          <Route path="/tournaments" element={<div>Gestion des tournois (à implémenter)</div>} />
          <Route path="/users" element={<div>Gestion des utilisateurs (à implémenter)</div>} />
        </Routes>
      </AdminLayout>
  );
};

export default AdminRoutes;