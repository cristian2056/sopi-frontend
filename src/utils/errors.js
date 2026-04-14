// src/utils/errors.js
// Utilidades para manejo de errores globales

export function parseError(error) {
  if (!error) return "Error desconocido";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.status && error.statusText) return `${error.status}: ${error.statusText}`;
  return JSON.stringify(error);
}

/**
 * Filtra un array de items usando una búsqueda segura (sin regex).
 * Nunca lanza errores aunque el usuario escriba caracteres especiales como * ( ) + etc.
 * @param {string} busqueda - texto ingresado por el usuario
 * @param {string} valor    - valor del campo a comparar
 * @returns {boolean}
 */
export function matchBusqueda(busqueda, valor) {
  if (!busqueda) return true;
  return (valor ?? "").toLowerCase().includes(busqueda.toLowerCase());
}
