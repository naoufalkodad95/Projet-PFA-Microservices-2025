import axios from "axios";

const API_URL = "http://localhost:5021/api/Utilisateurs"; 

// ✅ Fonction pour récupérer les utilisateurs 
export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ Fonction pour récupérer un utilisateur par ID
export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// ✅ Fonction pour mettre à jour un utilisateur
export const updateUser = async (id, user) => {
  return await axios.put(`${API_URL}/${id}`, user);
};


// ✅ Fonction pour créer un utilisateur
export const createUser = async (user) => {
  return await axios.post(API_URL, user);
};

// ✅ Fonction pour supprimer un utilisateur
export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

// ✅ Fonction pour mettre à jour un Password
export const updatePassword = async (id, data) => {
  return await axios.put(`${API_URL}/Modifier-MotDePasse/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// ✅ Fonction pour mettre à jour  Profile

export const updateProfile = async (user, token) => {
  return await axios.put(`${API_URL}/MonProfil`, user, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};





