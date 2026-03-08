// src/api/equipoExtras.api.js
import { http } from "../services/http";

export const equipoSoftwareApi = {
  listar:     ()         => http("/api/EquiposSoftware"),
  obtener:    (id)       => http(`/api/EquiposSoftware/${id}`),
  crear:      (body)     => http("/api/EquiposSoftware", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/EquiposSoftware/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/EquiposSoftware/${id}`, { method: "DELETE" }),
};

export const equipoRedApi = {
  listar:     ()         => http("/api/EquiposRed"),
  obtener:    (id)       => http(`/api/EquiposRed/${id}`),
  crear:      (body)     => http("/api/EquiposRed", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/EquiposRed/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/EquiposRed/${id}`, { method: "DELETE" }),
};

export const fotosApi = {
  listar:     ()         => http("/api/Fotos"),
  obtener:    (id)       => http(`/api/Fotos/${id}`),
  crear:      (body)     => http("/api/Fotos", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/Fotos/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/Fotos/${id}`, { method: "DELETE" }),
};

export const equipoAsignacionApi = {
  listar:     ()         => http("/api/EquiposAsignacion"),
  obtener:    (id)       => http(`/api/EquiposAsignacion/${id}`),
  crear:      (body)     => http("/api/EquiposAsignacion", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/EquiposAsignacion/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/EquiposAsignacion/${id}`, { method: "DELETE" }),
};