// src/stores/menuSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menus:    [],   // lista de { menuId, nombre, url, orden, icono, subMenus }
  permisos: {},   // { "Marcas": { leer, crear, modificar, eliminar }, ... }
  cargado:  false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,

  reducers: {
    setMenu: (state, action) => {
      const { menus, permisos } = action.payload;
      state.menus    = menus    ?? [];
      state.permisos = permisos ?? {};
      state.cargado  = true;
    },

    clearMenu: (state) => {
      state.menus    = [];
      state.permisos = {};
      state.cargado  = false;
    },
  },
});

export const { setMenu, clearMenu } = menuSlice.actions;

// Selectores
export const selectMenus    = (state) => state.menu.menus;
export const selectPermisos = (state) => state.menu.permisos;
export const selectMenuCargado = (state) => state.menu.cargado;

// Selector helper: permisos de un módulo específico
export const selectPermiso = (nombre) => (state) =>
  state.menu.permisos[nombre] ?? { leer: false, crear: false, modificar: false, eliminar: false };

export default menuSlice.reducer;