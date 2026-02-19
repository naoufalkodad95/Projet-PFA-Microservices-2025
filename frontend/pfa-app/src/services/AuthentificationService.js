import axios from "axios";

const API_URL = "http://localhost:5021/api/Auth"; 

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


export const createUser = async (user) => {
  return await axios.post(API_URL, user);
};


  export const logout = async () => {
    try {
      await fetch('http://localhost:5021/api/Auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      localStorage.clear();
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };