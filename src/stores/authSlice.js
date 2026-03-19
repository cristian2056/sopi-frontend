// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

//guarda datos de quien esta en la web
const initialState = {
  usuario: null,        // nombre, tipo, roles, etc.
  accessToken: null,    // el JWT 
  isAuthenticated: false, // si hay sesión activa
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

export default authSlice.reducer;