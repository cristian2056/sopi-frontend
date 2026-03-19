// src/components/ui/formStyles.js
// Estilos de formulario compartidos entre todos los tabs y formularios del sistema.
// Importar en lugar de redefinir en cada archivo.

/** Estilo base para inputs, selects y textareas */
export const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "1.5px solid #d1d5db",
  fontSize: "0.93rem",
  boxSizing: "border-box",
  background: "#fff",
  color: "#111",
  outline: "none",
};

/** Estilo base para etiquetas de campo */
export const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: 5,
  color: "#374151",
  fontSize: "0.87rem",
};

/** Color primario de la aplicación */
export const PRIMARY = "#4c7318";
export const PRIMARY_DISABLED = "#9ca3af";
