// src/api/auth.api.js
const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

export const authApi = {

  login: async (userName, password) => {
    const res = await fetch(`${API_BASE_URI}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userName, password }),
    });
    return res.json();
  },

  refresh: async () => {
    const res = await fetch(`${API_BASE_URI}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  // Carga los menús y permisos del usuario logueado
  // Se llama justo después del login con el accessToken recién obtenido
  obtenerMenu: async (accessToken) => {
    const res = await fetch(`${API_BASE_URI}/api/Menu`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res.json();
  },
};