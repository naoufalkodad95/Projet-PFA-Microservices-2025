import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../store/userSlice";
import { Button, Table, Container, Image, Alert, Col, Form, Row, Pagination} from "react-bootstrap";
import { deleteUser } from "../../../services/userService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AdminLayout from '../AdminLayout';
import ActionButtons from "../../../components/ActionButtons"; // adapte le chemin selon ton projet

const ListUtilisateur = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.users);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const userRole = localStorage.getItem("role");
const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (iD_Utilisateur) => {
    if (!iD_Utilisateur) {
      setDeleteError("ID utilisateur manquant - impossible de supprimer");
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        setDeleteError(null);
        await deleteUser(iD_Utilisateur);
        dispatch(fetchUsers()); // Rafraîchit la liste des utilisateurs
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setDeleteError(
          err.response?.data?.message || 
          "Erreur lors de la suppression. Veuillez réessayer."
        );
      }
    }
  };
  const handleEdit = (id) => {
    navigate(`/admin/utilisateur/modifier/${id}`);
  };
  // Redirection si l'utilisateur n'est pas admin
  if (userRole !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  // Recherche des utilisateurs en fonction du terme de recherche
  const filteredUsers = list.filter((user) =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Changer la page courante
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <Container className="mt-4">
        <h2 className="mb-4">📦 Liste des Utilisateurs</h2>

        {deleteError && <Alert variant="danger" dismissible onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>}
        
        {error && <Alert variant="danger" dismissible onClose={() => {}}>
          {error}
        </Alert>}
        <Row className="mb-3">
                <Col md={3}>
    <Link to="/admin/Utilisateur/Ajoute" className="btn btn-success w-100">
      ➕ Ajouter un Utilisateur
    </Link>
  </Col>
        <Col md={{ span: 4, offset: 5 }}>
    <Form.Control
      type="text"
      placeholder="Rechercher un Utilisateur..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Col>
</Row>



       

        {status === "loading" ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>CIN</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.iD_Utilisateur}>
                  <td>
                    {user.photoProfil ? (
                      <Image
                        src={user.photoProfil.startsWith('http') 
                          ? user.photoProfil 
                          : `http://localhost:5021${user.photoProfil}`}
                        alt={`${user.nom} ${user.prenom}`}
                        width="50"
                        height="50"
                        roundedCircle
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "/fallback-image.png";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div 
                        className="d-flex align-items-center justify-content-center" 
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          color: '#333',
                          fontWeight: 'bold'
                        }}
                      >
                        {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>{user.cin}</td>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.telephone}</td>
                  <td>{user.adresse}</td>
                  <td>{user.typeUtilisateur}</td>
                 
                  <td>
                  <div className="d-flex justify-content-start">

                    <ActionButtons item={user.iD_Utilisateur} onEdit={handleEdit} />
                    <ActionButtons   item={user} onDeleteUtilisateur={handleDelete} />
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Pagination */}
          {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
      </Pagination>

      </Container>
    </AdminLayout>
  );
};

export default ListUtilisateur;
