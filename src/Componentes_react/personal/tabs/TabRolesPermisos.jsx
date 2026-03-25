// src/pages/Personal/tabs/TabRolesPermisos.jsx
import React, { useEffect, useState } from "react";
import { personalApi } from "../../../api/personal.api";
import { rolesApi } from "../../../api/roles.api";

const PERMISOS = [
  { key: "leer",      label: "LISTAR"  },
  { key: "crear",     label: "CREAR"   },
  { key: "modificar", label: "EDITAR"  },
  { key: "eliminar",  label: "BORRAR"  },
];

export default function TabRolesPermisos({ persona }) {
  const [todosRoles,      setTodosRoles]      = useState([]);
  const [rolesAsignados,  setRolesAsignados]  = useState([]);
  const [rolActivo,       setRolActivo]       = useState(null); // rol seleccionado en el tab
  const [todosObjetos,    setTodosObjetos]    = useState([]);
  const [matrizPermisos,  setMatrizPermisos]  = useState({}); // { objetoId: RolObjetoDto }
  const [loading,         setLoading]         = useState(true);
  const [guardando,       setGuardando]       = useState(false);
  const [msg,             setMsg]             = useState({ tipo: "", texto: "" });

  const usuarioId = persona.usuario?.usuarioId;

  // ── Carga inicial ─────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const [rolesRes, objetosRes] = await Promise.all([
          rolesApi.listar(),
          personalApi.listarObjetos(),
        ]);
        const roles   = rolesRes.datos   ?? [];
        const objetos = objetosRes.datos ?? [];
        setTodosRoles(roles);
        setTodosObjetos(objetos);

        if (usuarioId) {
          const asignadosRes = await personalApi.listarRolesUsuario(usuarioId);
          const asignados = asignadosRes.datos ?? [];
          setRolesAsignados(asignados);
          // Seleccionar el primer rol asignado por defecto
          if (asignados.length > 0) {
            const primero = roles.find(r => r.rolId === asignados[0].rolId) ?? asignados[0];
            setRolActivo(primero);
            await cargarMatriz(primero.rolId, objetos);
          }
        }
      } catch (e) {
        setMsg({ tipo: "err", texto: e.message || "Error al cargar." });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuarioId]);

  // ── Cargar matriz de permisos para un rol ─────────────────
  const cargarMatriz = async (rolId, objetos = todosObjetos) => {
    try {
      const res = await personalApi.listarObjetosRol(rolId);
      const permisos = res.datos ?? [];
      // Construir mapa objetoId → permiso (o null si no existe)
      const mapa = {};
      objetos.forEach(obj => {
        const p = permisos.find(x => x.objetoId === obj.objetoId);
        mapa[obj.objetoId] = p ?? null;
      });
      setMatrizPermisos(mapa);
    } catch {
      setMatrizPermisos({});
    }
  };

  // ── Cambiar rol activo ────────────────────────────────────
  const seleccionarRol = async (rol) => {
    setRolActivo(rol);
    await cargarMatriz(rol.rolId);
  };

  // ── Asignar / quitar rol al usuario ──────────────────────
  const toggleRol = async (rolId, asignado) => {
    setMsg({ tipo: "", texto: "" });
    try {
      if (asignado) {
        await personalApi.quitarRol(usuarioId, rolId);
      } else {
        await personalApi.asignarRol({ usuarioId, rolId });
      }
      const res = await personalApi.listarRolesUsuario(usuarioId);
      setRolesAsignados(res.datos ?? []);
      setMsg({ tipo: "ok", texto: asignado ? "Rol removido." : "Rol asignado." });
    } catch (e) {
      setMsg({ tipo: "err", texto: e.message });
    }
  };

  // ── Toggle de un permiso en la matriz ────────────────────
  const togglePermiso = async (objetoId, campo) => {
    if (!rolActivo) return;
    const actual = matrizPermisos[objetoId];
    setGuardando(true);
    setMsg({ tipo: "", texto: "" });

    try {
      if (!actual) {
        // No existe → crear con ese permiso en true
        const body = {
          rolId: rolActivo.rolId,
          objetoId,
          leer:      campo === "leer",
          crear:     campo === "crear",
          modificar: campo === "modificar",
          eliminar:  campo === "eliminar",
        };
        const res = await personalApi.asignarObjetoRol(body);
        setMatrizPermisos(p => ({ ...p, [objetoId]: res.datos }));
      } else {
        // Ya existe → actualizar ese campo
        const body = {
          ...actual,
          [campo]: !actual[campo],
        };
        const res = await personalApi.actualizarObjetoRol(actual.rolObjetoId, body);
        setMatrizPermisos(p => ({ ...p, [objetoId]: res.datos }));
      }
    } catch (e) {
      setMsg({ tipo: "err", texto: e.message || "Error al guardar permiso." });
    } finally {
      setGuardando(false);
    }
  };

  // ── Estilos ───────────────────────────────────────────────
  const rolesAsignadosIds = rolesAsignados.map(r => r.rolId);

  if (loading) return <div style={{ color: "#888", padding: "20px 0" }}>Cargando...</div>;

  if (!usuarioId) return (
    <div style={{ color: "#9ca3af", fontStyle: "italic", padding: "20px 0" }}>
      Esta persona no tiene usuario. No se pueden asignar roles.
    </div>
  );

  return (
    <div>
      {msg.texto && (
        <div style={{ padding: "10px 16px", borderRadius: 8, marginBottom: 16,
          background: msg.tipo === "ok" ? "#dcfce7" : "#fee2e2",
          color: msg.tipo === "ok" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
          {msg.texto}
        </div>
      )}

      {/* ── SECCIÓN 1: ASIGNAR ROLES AL USUARIO ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#6b7280",
          textTransform: "uppercase", letterSpacing: 1,
          marginBottom: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
          Roles del usuario
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {todosRoles.map(rol => {
            const asignado = rolesAsignadosIds.includes(rol.rolId);
            return (
              <div key={rol.rolId} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 20,
                background: asignado ? "#dcfce7" : "#f3f4f6",
                border: `1px solid ${asignado ? "#86efac" : "#e5e7eb"}`,
              }}>
                <span style={{ fontWeight: 600, fontSize: "0.88rem",
                  color: asignado ? "#16a34a" : "#6b7280" }}>
                  {rol.nombre}
                </span>
                <button onClick={() => toggleRol(rol.rolId, asignado)}
                  style={{ padding: "2px 8px", borderRadius: 10, border: "none",
                    background: asignado ? "#fee2e2" : "#4c7318",
                    color: asignado ? "#dc2626" : "#fff",
                    fontWeight: 700, cursor: "pointer", fontSize: "0.78rem" }}>
                  {asignado ? "✕" : "+ Asignar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECCIÓN 2: MATRIZ DE PERMISOS ── */}
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#6b7280",
          textTransform: "uppercase", letterSpacing: 1,
          marginBottom: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
          Permisos por módulo
        </div>

        {rolesAsignados.length === 0 ? (
          <div style={{ color: "#9ca3af", fontStyle: "italic" }}>
            Asigná al menos un rol para configurar sus permisos.
          </div>
        ) : (
          <>
            {/* Selector de rol */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {rolesAsignados.map(ra => {
                const rol = todosRoles.find(r => r.rolId === ra.rolId) ?? ra;
                const activo = rolActivo?.rolId === rol.rolId;
                return (
                  <button key={rol.rolId} onClick={() => seleccionarRol(rol)}
                    style={{ padding: "7px 18px", borderRadius: 8, border: "none",
                      background: activo ? "#4c7318" : "#f3f4f6",
                      color: activo ? "#fff" : "#374151",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}>
                    {rol.nombre ?? ra.rolNombre}
                  </button>
                );
              })}
            </div>

            {/* Tabla tipo Excel */}
            {rolActivo && (
              <div style={{ overflowX: "auto", borderRadius: 10,
                border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      <th style={{ padding: "12px 20px", textAlign: "left",
                        fontWeight: 700, color: "#374151", borderBottom: "2px solid #e5e7eb",
                        width: 180 }}>
                        PÁGINAS
                      </th>
                      {PERMISOS.map(p => (
                        <th key={p.key} style={{ padding: "12px 20px", textAlign: "center",
                          fontWeight: 700, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>
                          {p.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todosObjetos.map((obj, i) => {
                      const permiso = matrizPermisos[obj.objetoId];
                      return (
                        <tr key={obj.objetoId}
                          style={{ background: i % 2 === 0 ? "#fff" : "#fafafa",
                            transition: "background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}>
                          <td style={{ padding: "12px 20px", fontWeight: 600,
                            color: "#111827", borderBottom: "1px solid #f3f3f3" }}>
                            {obj.nombre}
                          </td>
                          {PERMISOS.map(p => {
                            const activo = permiso?.[p.key] === true;
                            return (
                              <td key={p.key} style={{ padding: "12px 20px", textAlign: "center",
                                borderBottom: "1px solid #f3f3f3" }}>
                                <button
                                  onClick={() => togglePermiso(obj.objetoId, p.key)}
                                  disabled={guardando}
                                  title={activo ? "Quitar permiso" : "Dar permiso"}
                                  style={{
                                    width: 32, height: 32, borderRadius: 6,
                                    border: `2px solid ${activo ? "#4c7318" : "#d1d5db"}`,
                                    background: activo ? "#4c7318" : "#fff",
                                    color: activo ? "#fff" : "#9ca3af",
                                    fontWeight: 900, fontSize: "1rem",
                                    cursor: guardando ? "not-allowed" : "pointer",
                                    display: "inline-flex", alignItems: "center",
                                    justifyContent: "center", transition: "background 0.15s, border-color 0.15s, color 0.15s",
                                  }}>
                                  {activo ? "✓" : ""}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
