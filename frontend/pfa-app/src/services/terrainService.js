// src/services/terrainService.js
import { api } from './api';

export const checkTerrainAvailability = async (terrain, dateDebut, dateFin) => {
  return api.get('/api/v1/matchs/terrain-disponible', {
    params: { terrain, dateDebut, dateFin }
  });
};

export const getMatchesByPeriod = async (debut, fin) => {
  return api.get('/api/v1/matchs/periode', {
    params: { debut, fin }
  });
};