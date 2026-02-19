// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import NavigationBar from "./components/Navbar";
// import ListUtilisateur from "./pages/Admin/Utilisateurs/ListUtilisateur";
// import AjouterUtilisateur from "./pages/Admin/Utilisateurs/AjouterUtilisateur";
// import ModifierUtilisateur from "./pages/Admin/Utilisateurs/ModifierUtilisateur";
// import Register from "./pages/Authentification/Register";
// import Login from "./pages/Authentification/Login";
// import Accueil from "./pages/Accueil";
// import Dashboard from "./pages/Dashboard";

// const PrivateRoute = ({ children }) => {
//   return localStorage.getItem("token") ? children : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <NavigationBar />
//         <Routes>
//           <Route path="/" element={<ListUtilisateur />} />
//           <Route path="/add" element={<AjouterUtilisateur/>} />
//           <Route path="/ModifierUtilisateur/:id" element={<ModifierUtilisateur />} />
//           <Route path="/Register" element={<Register />} />
//           <Route path="/Accueil" element={<Accueil />} />
//           <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//         <Route path="*" element={<Navigate to="/login" />} />
//           </Routes>
//       </Router>
//     </Provider>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import ListUtilisateur from "./pages/Admin/Utilisateurs/ListUtilisateur";
import AjouterUtilisateur from "./pages/Admin/Utilisateurs/AjouterUtilisateur";
import ModifierUtilisateur from "./pages/Admin/Utilisateurs/ModifierUtilisateur";
import ModifierProfilAdmin from "./pages/Admin/ModifierProfilAdmin";
import ModifiierProfilCapitaine from "./pages/Utilisateurs/ModifiierProfilCapitaine";
import Register from "./pages/Authentification/Register";
import Login from "./pages/Authentification/Login";
import Accueil from "./pages/Accueil";
import Testc from "./pages/testc";
import AdminHeader from "./pages/Admin/AdminHeader";
import AdminLayout from "./pages/Admin/AdminLayout";
import JoueurDashboard from "./pages/Utilisateurs/Joueur/JoueurDashboard";
import Terrains from "./pages/Admin/Terrains/Terrains";
import Reservation from "./pages/Utilisateurs/Capitaine/Reservation";
import ReservationJ from "./pages/Utilisateurs/Joueur/ReservationJ";
import ReservationManagement from "./pages/Admin/Reservation/ReservationManagement";
import { ToastContainer } from 'react-toastify';



                        // wael

import TournoiList from './components/Tournoi/TournoiList';
import TournoiForm from './components/Tournoi/TournoiForm';
import TournoiDetails from './components/Tournoi/TournoiDetails';
import EquipeList from './components/Equipe/EquipeList';
import EquipeForm from './components/Equipe/EquipeForm';
import EquipeDetails from './components/Equipe/EquipeDetails';
import TeamManagement from "./pages/Admin/TeamManagement";
import ChallengesPage from "./pages/Admin/ChallengesPage";
import MatchesPage from "./pages/Admin/MatchesPage";
import MatchDetailPage from "./pages/Admin/MatchDetailPage";
import RequireAdmin from "./components/admin/RequireAdmin";
import AdminRoutes from "./routes/AdminRoutes";
import TournamentDetails from "./pages/Admin/TournamentDetails";
import PaymentHistory from "./pages/Admin/PaymentHistory";
import FindPartners from "./pages/Admin/FindPartners";
import JoinTeam from "./pages/Admin/JoinTeam";
// Ajout du composant NotificationPage
import NotificationPage from './components/NotificationPage';
// Ajout du formulaire de vérification de paiement
import PaymentVerificationForm from './components/Payment/PaymentVerificationForm';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

function App() {
  return (

    <Provider store={store}>
      <Router>
      <ToastContainer />
      {/* <NavigationBar /> */}
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/testc" element={<Testc />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/modifier-profil-Admin/:id" element={<ModifierProfilAdmin />} />
          <Route path="/modifier-profil-Utilisateur/:id" element={<ModifiierProfilCapitaine />} />

          <Route path="admin/Utilisateur/Ajoute" element={                <AjouterUtilisateur />} />
          <Route path="/admin/Utilisateur/List" element={                <ListUtilisateur />} />
          <Route path="/admin/utilisateur/modifier/:id" element={                <ModifierUtilisateur />} />
          <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />
          <Route path="/admin/Reservation/Terrains" element={                <Terrains />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="/reservationsJ" element={<ReservationJ />} />

          <Route path="/admin/Reservation/ReservationManagement" element={                <ReservationManagement />} />




                            {/* Wael */}

<Route path="/tournois" element={<TournoiList />} />
          <Route path="/tournois/create" element={<TournoiForm />} />
          <Route path="/tournois/edit/:id" element={<TournoiForm />} />
          <Route path="/tournois/:id" element={<TournoiDetails />} />
          
          {/* Routes pour les équipes */}
          <Route path="/equipes" element={<EquipeList />} />
          <Route path="/equipes/create" element={<EquipeForm />} />
          <Route path="/equipes/edit/:id" element={<EquipeForm />} />
          <Route path="/equipes/:id" element={<EquipeDetails />} />
                    {/* Nouvelle route pour la vérification des paiements */}

               <Route path="/admin/payments/verify" element={<PaymentVerificationForm />} />
                    
                    {/* Nouvelle route pour les notifications */}
                    <Route path="/admin/notifications" element={<NotificationPage />} />
          
                            {/*Bilal*/}
            <Route path="/PaymentHistory" element={<PaymentHistory />} />
            <Route path="/FindPartners" element={<FindPartners />} />
            <Route path="/JoinTeam" element={<JoinTeam />} />
            <Route path="/TournamentDetails" element={<TournamentDetails />} />


            {/* Routes protégées - ces routes devraient être protégées par un composant RequireAuth */}
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/:matchId" element={<MatchDetailPage />} />

            {/* Routes admin */}
            <Route
                path="/admin/*"
                element={
                    <RequireAdmin>
                        <AdminRoutes />
                    </RequireAdmin>
                }
            />




          {/* Routes protégées par rôle */}
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute requiredRole="Admin">
                <AdminHeader />

              </PrivateRoute>
            } 
          />


<Route path="/login" element={<Login />} />
        
          <Route 
            path="/capitaine/*" 
            element={
              <PrivateRoute requiredRole="Capitaine">
                {/* <CapitaineDashboard /> */}
                {/* <Header /> */}
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/joueur" 
            element={
              <PrivateRoute requiredRole="Joueur">

                <JoueurDashboard />

              </PrivateRoute>
            } 
          />

          {/* Routes admin */}
          <Route 
            path="/utilisateurs" 
            element={
              <PrivateRoute requiredRole="Admin">
                <ListUtilisateur />
              </PrivateRoute>
            } 
          />
          {/* <Route 
            path="/utilisateurs/ajouter" 
            element={
              <PrivateRoute requiredRole="Admin">
                <AjouterUtilisateur />
              </PrivateRoute>
            }  */}
          {/* /> */}
          {/* <Route 
            path="/utilisateurs/modifier/:id" 
            element={
              <PrivateRoute requiredRole="Admin">
                <ModifierUtilisateur />
              </PrivateRoute>
            } 
          /> */}

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;