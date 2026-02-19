import axios from 'axios';

const API_BASE_URL = 'https://api.futsal-center.com/v1';

const api = {
  // Récupérer les réservations en attente
  getPendingReservations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations?status=pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending reservations:', error);
      throw error;
    }
  },

  // Récupérer les réservations confirmées
  getConfirmedReservations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations?status=confirmed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching confirmed reservations:', error);
      throw error;
    }
  },

  // Récupérer l'historique des réservations
  getReservationHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation history:', error);
      throw error;
    }
  },

  // Confirmer une réservation
  confirmReservation: async (reservationId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/reservations/${reservationId}/confirm`
      );
      return response.data;
    } catch (error) {
      console.error('Error confirming reservation:', error);
      throw error;
    }
  },

  // Annuler une réservation
  cancelReservation: async (reservationId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/reservations/${reservationId}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  },

  // Modifier une réservation
  updateReservation: async (reservationId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/reservations/${reservationId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }
};

export default api;