// src/pages/Personal/tabs/TabInfoPersonal.jsx
import React, { useState } from "react";
import { personalApi } from "../../../api/personal.api";

export default function TabInfoPersonal({ persona, personaId, onActualizado }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombres: persona.nombres || "",
    apellidosPaterno: persona.apellidosPaterno || "",
    apellidosMaterno: persona.apellidosMaterno || "",
    email: persona.email || "",
    telefono: persona.telefono || "",
    direccion: persona.direccion || "",
    sexo: persona.sexo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      await personalApi.actualizarPersona(personaId, form);
      const data = await personalApi.obtenerPersona(personaId);
      if (data.exito) onActualizado(data.datos);
      setEditing(false);
    } catch (e) {
      alert("Error al guardar: " + (e.message || "Intente de nuevo"));
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Nombre</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.nombres}</div>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Apellido Paterno</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.apellidosPaterno}</div>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Apellido Materno</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.apellidosMaterno}</div>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Sexo</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.sexo || "-"}</div>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Email</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.email || "-"}</div>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Teléfono</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.telefono || "-"}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Dirección</label>
            <div style={{ fontSize: "1rem", marginTop: 4 }}>{persona.direccion || "-"}</div>
          </div>
        </div>
        <button onClick={() => setEditing(true)}
          style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          ✏️ Editar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Nombre</label>
          <input type="text" name="nombres" value={form.nombres} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Apellido Paterno</label>
          <input type="text" name="apellidosPaterno" value={form.apellidosPaterno} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Apellido Materno</label>
          <input type="text" name="apellidosMaterno" value={form.apellidosMaterno} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Sexo</label>
          <select name="sexo" value={form.sexo} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }}>
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }} />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>Dirección</label>
          <textarea name="direccion" value={form.direccion} onChange={handleChange} rows="3"
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", marginTop: 4, fontSize: "1rem", fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleGuardar} disabled={loading}
          style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          💾 Guardar
        </button>
        <button onClick={() => setEditing(false)}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#4c7318", fontWeight: 700, cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
