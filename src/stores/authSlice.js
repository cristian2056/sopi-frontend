// src/store/authSlice.js
// Estado de autenticación en Redux (memoria del navegador, se pierde al cerrar pestaña).
// El accessToken vive SOLO aquí — nunca en localStorage para evitar ataques XSS.
// El refreshToken vive en la cookie HttpOnly del navegador (invisible para JS).
//
// Dependencias del flujo:
//   LoginPage  → dispatch(setCredentials)  después de login exitoso
//   http.js    → dispatch(setCredentials)  después de refresh exitoso
//   http.js    → dispatch(logoutLocal)     cuando el refresh falla (sesión vencida)
//   Navbar/etc → dispatch(logoutLocal)     cuando el usuario cierra sesión manualmente
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usuario: null,           // datos de sesión: id, nombre, rolId, rolNombre
  accessToken: null,       // JWT de corta duración — se usa en cada request
  isAuthenticated: false,  // true mientras haya token válido en memoria
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {//llama después del login o refresh exitoso     Guarda el token y los datos
      const { accessToken, usuario } = action.payload;
      state.accessToken     = accessToken;
      state.usuario         = usuario;
      state.isAuthenticated = true;
    },

    //limpia el estado cuando el usuario cierra sesión
    logoutLocal: (state) => {
      state.accessToken     = null;
      state.usuario         = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logoutLocal } = authSlice.actions;

// para leer el estado desde cualquier componente
export const selectUsuario         = (state) => state.auth.usuario;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken           = (state) => state.auth.accessToken;

// Selectores de rol — usan rolId exacto del backend (1=Admin, 2=Técnico, 3=Usuario)
export const selectEsAdmin   = (state) => state.auth.usuario?.rolId === 1;
export const selectEsTecnico = (state) => state.auth.usuario?.rolId === 2;
export const selectEsUsuario = (state) => state.auth.usuario?.rolId === 3;

export default authSlice.reducer;