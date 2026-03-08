// src/api/personal.api.js
import { http } from "../services/http";

export const personalApi = {
  // ── Personas ──────────────────────────────────────────────
  listarPersonas:    ()              => http("/api/Personas"),
  crearPersona:      (body)          => http("/api/Personas",             { method: "POST",   body }),
  actualizarPersona: (id, body)      => http(`/api/Personas/${id}`,       { method: "PUT",    body }),
  eliminarPersona:   (id)            => http(`/api/Personas/${id}`,       { method: "DELETE"       }),

  // ── Usuarios ──────────────────────────────────────────────
  crearUsuario:      (body)          => http("/api/Personas/usuarios",       { method: "POST", body }),
  actualizarUsuario: (id, body)      => http(`/api/Personas/usuarios/${id}`, { method: "PUT",  body }),

  // ── Roles ─────────────────────────────────────────────────
  listarRoles:       ()              => http("/api/Roles"),
  listarObjetos:    ()                => http("/api/Objetos"),
  listarObjetosRol: (rolId)           => http(`/api/RolObjetos/rol/${rolId}`),
  asignarRol:        (body)          => http("/api/UsuarioRoles",         { method: "POST",   body }),
  quitarRol:         (usuarioId, rolId) => http(`/api/UsuarioRoles/${usuarioId}/${rolId}`, { method: "DELETE" }),
  asignarObjetoRol: (body)            => http("/api/RolObjetos",            { method: "POST",   body }),
  quitarObjetoRol:  (rolObjetoId)     => http(`/api/RolObjetos/${rolObjetoId}`, { method: "DELETE" }),
  actualizarObjetoRol: (rolObjetoId, body) => http(`/api/RolObjetos/${rolObjetoId}`, { method: "PUT", body }),

  obtenerPersona:     (id)           => http(`/api/Personas/${id}`),
  listarRolesUsuario: (usuarioId) => http(`/api/UsuarioRoles/usuario/${usuarioId}`),
};