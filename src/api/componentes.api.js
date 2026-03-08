// src/api/componentes.api.js
import { http } from "../services/http";

export const componentesApi = {
  listar:     ()         => http("/api/Componentes"),
  obtener:    (id)       => http(`/api/Componentes/${id}`),
  crear:      (body)     => http("/api/Componentes", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/Componentes/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/Componentes/${id}`, { method: "DELETE" }),
};

// Composicion = relación equipo ↔ componente (con specs, marca, estado, etc.)
export const composicionesApi = {
  listar:          ()         => http("/api/Composiciones"),
  listarPorEquipo: (equipoId) => http(`/api/Composiciones/equipo/${equipoId}`),
  obtener:         (id)       => http(`/api/Composiciones/${id}`),
  crear:           (body)     => http("/api/Composiciones", { method: "POST", body }),
  actualizar:      (id, body) => http(`/api/Composiciones/${id}`, { method: "PUT", body }),
  eliminar:        (id)       => http(`/api/Composiciones/${id}`, { method: "DELETE" }),
};