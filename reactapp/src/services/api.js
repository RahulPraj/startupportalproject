// src/services/api.js
import axios from 'axios';

const API_URL = 'https://8080-ecefccaacaee334948288bdfddbacaacfbcfour.premiumproject.examly.io/api';

// Get all ideas
export const getIdeas = async () => {
  const res = await axios.get(`${API_URL}/ideas`);
  return res.data;
};

// Get validated ideas
export const getValidatedIdeas = async () => {
  const res = await axios.get(`${API_URL}/ideas/validated`);
  return res.data;
};

// Add a new idea
export const addIdea = async (idea) => {
  const res = await axios.post(`${API_URL}/ideas`, idea, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data;
};

// Delete an idea
export const deleteIdea = async (id) => {
  return axios.delete(`${API_URL}/ideas/${id}`);
};