// src/api/auth.api.js
// ─────────────────────────────────────────────────────────────────
// FLUJO COMPLETO DE AUTENTICACIÓN (JWT + Refresh Token)
//
//  1. LOGIN  → POST /auth/login
//             El backend valida credenciales, genera:
//               • accessToken (JWT, corta duración) → devuelto en body
//               • refreshToken (largo plazo)        → guardado en cookie HttpOnly
//             El frontend guarda el accessToken en Redux (memoria).
//
//  2. USO    → Cada request lleva "Authorization: Bearer <accessToken>"
//             (lo inyecta automáticamente http.js leyendo Redux)
//
//  3. REFRESH → Cuando el backend responde 401 (token vencido),
//             http.js llama automáticamente a POST /auth/refresh.
//             La cookie HttpOnly viaja sola (navegador la envía solo).
//             El backend rota el refreshToken y devuelve un nuevo accessToken.
//             http.js actualiza Redux y reintenta la request original.
//
//  4. LOGOUT → POST /auth/logout
//             El backend revoca el refreshToken en DB y borra la cookie.
//             El frontend limpia Redux con logoutLocal().
// ─────────────────────────────────────────────────────────────────
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

  // Carga menús y permisos del usuario → GET /api/Menu/usuario/{usuarioId}
  // Respuesta: { exito, datos: { menus: MenuItemDto[], permisos: { Modulo: {leer,crear,modificar,eliminar} } } }
  obtenerMenu: async (usuarioId, accessToken) => {
    const res = await fetch(`${API_BASE_URI}/api/Menu/usuario/${usuarioId}`, {
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