import { http } from "../services/http";
import { store } from "../stores/store";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

export const equiposApi = {
  listar:     ()         => http("/api/Equipos"),
  obtener:    (id)       => http(`/api/Equipos/${id}`),
  crear:      (body)     => http("/api/Equipos", { method: "POST", body }),
  actualizar: (id, body) => http(`/api/Equipos/${id}`, { method: "PUT", body }),
  eliminar:   (id)       => http(`/api/Equipos/${id}`, { method: "DELETE" }),

  descargarPdf: async (id, codigoPatrimonial) => {
    const token = store.getState().auth.accessToken;
    const res = await fetch(`${API_BASE_URI}/api/Equipo/${id}/pdf`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status} al generar el PDF.`);
    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `HojaInventario-${codigoPatrimonial ?? id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /** Devuelve una blob URL para previsualizar el PDF en un <iframe> */
  obtenerBlobUrlPdf: async (id) => {
    const token = store.getState().auth.accessToken;
    const res = await fetch(`${API_BASE_URI}/api/Equipo/${id}/pdf`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status} al generar el PDF.`);
    const blob = await res.blob();
    return window.URL.createObjectURL(blob);
  },
};
