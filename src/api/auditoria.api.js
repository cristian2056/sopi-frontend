// src/api/auditoria.api.js
import { http } from "../services/http";

export const auditoriaApi = {
  /** POST /api/auditoria/listar — con filtros opcionales */
  listar: (filtro = {}) =>
    http("/api/auditoria/listar", { method: "POST", body: filtro }),

  /** GET /api/auditoria/usuario/{usuarioId}?desde=&hasta= */
  porUsuario: (usuarioId, desde, hasta) => {
    if (!/^\d+$/.test(String(usuarioId))) {
      return Promise.reject(new Error("usuarioId inválido"));
    }
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return http(`/api/auditoria/usuario/${usuarioId}${qs}`);
  },

  /** POST /api/auditoria/registrar */
  registrar: (body) =>
    http("/api/auditoria/registrar", { method: "POST", body }),
};
