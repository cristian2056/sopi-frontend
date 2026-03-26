// src/api/notificaciones.api.js
import { http } from "../services/http";

export const notificacionesApi = {
  listar:  ()     => http("/api/Notificaciones"),
  marcarLeida: (id) => http(`/api/Notificaciones/${id}/leer`, { method: "POST" }),
  marcarTodas: ()   => http("/api/Notificaciones/leer-todas", { method: "POST" }),
};
