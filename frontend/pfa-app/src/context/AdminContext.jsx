import React, { createContext, useState, useEffect, useContext } from 'react';
import adminService from '../services/adminService';

// Création du contexte Admin
export const AdminContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAdmin = () => useContext(AdminContext);

// Provider du contexte Admin
const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Vérifier le statut administrateur au chargement
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminStatus = await adminService.checkAdminStatus();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Charger les statistiques du tableau de bord
  const loadDashboardStats = async () => {
    try {
      const stats = await adminService.getDashboardStats();
      setAdminStats(stats);
      return stats;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      return null;
    }
  };

  // Charger les données si l'utilisateur est admin
  useEffect(() => {
    if (isAdmin && !loading) {
      loadDashboardStats();
    }
  }, [isAdmin, loading]);

  // Se connecter en tant qu'admin
  const login = async (credentials) => {
    try {
      // À adapter selon votre système d'authentification
      // Exemple simple avec stockage local
      localStorage.setItem('user', JSON.stringify({
        ...credentials,
        role: 'ADMIN'
      }));

      setIsAdmin(true);
      await loadDashboardStats();
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion admin:', error);
      return false;
    }
  };

  // Se déconnecter
  const logout = () => {
    localStorage.removeItem('user');
    setIsAdmin(false);
    setAdminStats(null);
    setNotifications([]);
  };

  // Valeurs et fonctions à exposer dans le contexte
  const contextValue = {
    isAdmin,
    loading,
    adminStats,
    notifications,
    loadDashboardStats,
    login,
    logout
  };

  return (
      <AdminContext.Provider value={contextValue}>
        {children}
      </AdminContext.Provider>
  );
};

export default AdminProvider;