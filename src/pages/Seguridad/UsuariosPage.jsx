// src/pages/Seguridad/UsuariosPage.jsx
import { useEffect, useState } from "react";
import { personalApi }     from "../../api/personal.api";
import { http }            from "../../services/http";
import PersonaForm         from "../Personal/PersonaForm";
import UsuarioEditModal from "./UsuarioEditModal";
import ModalDialog      from "../../components/ui/ModalDialog";
import DataTable           from "../../components/ui/DataTable";
import { usePermiso }      from "../../stores/menuSlice";

// ─── Columnas de la tabla (recibe roles para resolver el nombre) ──────────────
const makeColumnas = (roles) => [
  {
    key: "nombre", label: "Nombre completo", ancho: 220,
    render: (p) => `${p.nombres} ${p.apellidosPaterno} ${p.apellidosMaterno}`,
  },
  {
    key: "documento", label: "Documento", ancho: 140,
    render: (p) => `${p.tipoDocumento}: ${p.numeroDocumento}`,
  },
  {
    key: "userName", label: "Usuario", ancho: 130,
    render: (p) => p.usuario
      ? <span style={{ background: "#e0e7ff", color: "#4338ca", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
          @{p.usuario.userName}
        </span>
      : <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>Sin usuario</span>,
  },
  {
    key: "rol", label: "Rol", ancho: 150,
    render: (p) => {
      const rolNombre = roles.find(r => r.rolId === p.usuario?.rolId)?.nombre;
      return rolNombre
        ? <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
            {rolNombre}
          </span>
        : <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>Sin rol</span>;
    },
  },
  {
    key: "activo", label: "Estado", ancho: 110,
    render: (p) => p.usuario
      ? <span style={{
          background: p.usuario.activo ? "#dcfce7" : "#fee2e2",
          color: p.usuario.activo ? "#16a34a" : "#dc2626",
          borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem",
        }}>
          {p.usuario.activo ? "Activo" : "Inactivo"}
        </span>
      : <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
          ⚠️ Sin usuario
        </span>,
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────
export default function UsuariosPage() {
  const { crear, modificar, eliminar } = usePermiso("Usuarios");
  const [items,       setItems]       = useState([]);
  const [roles,       setRoles]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState("");
  const [confirm,     setConfirm]     = useState({ open: false, personaId: null, loading: false, error: "" });
  const [form,        setForm]        = useState(null);   // null = cerrado, {} = crear nuevo
  const [formLoading, setFormLoading] = useState(false);
  const [formError,   setFormError]   = useState("");
  const [editTarget,  setEditTarget]  = useState(null);

  // ── Cargar personas, usuarios y roles ─────────────────────
  const cargar = async () => {
    setLoading(true);
    try {
      const [dataPersonas, dataRoles, dataUsuarios] = await Promise.all([
        personalApi.listarPersonas(),
        personalApi.listarRoles(),
        http("/api/Usuarios").catch(() => ({ datos: [] })),
      ]);
      const toArr = (v) => Array.isArray(v) ? v : v ? [v] : [];
      const usuariosMap = {};
      toArr(dataUsuarios.datos).forEach(u => { usuariosMap[u.usuarioId] = u; });

      // Mostrar TODAS las personas (incluso las sin usuario)
      const personas = toArr(dataPersonas.datos);
      personas.forEach(p => {
        if (!p.usuario?.usuarioId) return;
        const full = usuariosMap[p.usuario.usuarioId];
        if (full) p.usuario = { ...p.usuario, rolId: full.rolId, dependenciaId: full.dependenciaId, activo: full.activo };
      });

      setItems(personas);
      setRoles(toArr(dataRoles.datos));
    } catch (e) {
      setFormError(e.message || "Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ── Crear nueva persona + usuario ─────────────────────────
  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      const respPersona = await personalApi.crearPersona({
        tipoDocumento:    valores.tipoDocumento,
        numeroDocumento:  valores.numeroDocumento,
        nombres:          valores.nombres,
        apellidosPaterno: valores.apellidosPaterno,
        apellidosMaterno: valores.apellidosMaterno,
        sexo:             valores.sexo,
        email:            valores.email,
        telefono:         valores.telefono,
        direccion:        valores.direccion,
        activo:           true,
      });
      if (respPersona?.exito === false) throw new Error(respPersona.mensaje || "No se pudo crear la persona.");

      const personaId = respPersona.datos?.personaId ?? respPersona.datos?.id;
      if (!personaId) throw new Error("No se pudo obtener el ID de la persona creada.");

      try {
        const rolNombre = roles.find(r => r.rolId === Number(valores.rolId))?.nombre ?? "";
        const resU = await personalApi.crearUsuario({
          personaId,
          dependenciaId:  Number(valores.dependenciaId) || null,
          rolId:          Number(valores.rolId) || null,
          rolNombre,
          userName:       valores.userName,
          password:       valores.password,
          nombreCompleto: `${valores.nombres} ${valores.apellidosPaterno} ${valores.apellidosMaterno}`.trim(),
          activo:         true,
        });
        if (resU?.exito === false) throw new Error(resU.mensaje || "No se pudo crear el usuario.");
      } catch (eUser) {
        // Rollback: eliminar la persona para no dejar huérfanos
        await personalApi.eliminarPersona(personaId).catch(() => {});
        throw eUser;
      }

      setFormError("");
      setForm(null);
      cargar();
    } catch (e) {
      setFormError(e.message || "No se pudo guardar.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Eliminar ──────────────────────────────────────────────
  const confirmarEliminar = async () => {
    setConfirm(p => ({ ...p, loading: true }));
    try {
      await personalApi.eliminarPersona(confirm.personaId);
      setConfirm({ open: false, personaId: null, loading: false, error: "" });
      cargar();
    } catch (e) {
      setConfirm(p => ({ ...p, loading: false, error: e.message || "No se pudo eliminar." }));
    }
  };

  // ── Filtro (nombre, usuario y rol) ────────────────────────
  const filtrados = items.filter(p => {
    const rolNombre = roles.find(r => r.rolId === p.usuario?.rolId)?.nombre ?? "";
    return `${p.nombres ?? ""} ${p.apellidosPaterno ?? ""} ${p.apellidosMaterno ?? ""} ${p.usuario?.userName ?? ""} ${rolNombre}`
      .toLowerCase().includes(busqueda.toLowerCase());
  });


  return (
    <div style={{ width: "100%", maxWidth: 1200 }}>

      {/* Barra superior */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, flex: 1, fontSize: "1.3rem", fontWeight: 800, color: "#232946" }}>
          👥 Usuarios del sistema
        </h2>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, usuario o rol..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "0.93rem", minWidth: 240 }}
        />
        {crear && <button
          onClick={() => setForm({})}
          style={{ padding: "9px 20px", borderRadius: 8, background: "#4c7318", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
          + Nuevo usuario
        </button>}
      </div>

      {/* Tabla */}
      <DataTable
        columnas={makeColumnas(roles)}
        datos={filtrados}
        loading={loading}
        keyField="personaId"
        mensajeVacio="No hay usuarios registrados."
        onEdit={modificar ? (p) => setEditTarget(p) : undefined}
        onDelete={eliminar ? (p) => setConfirm({ open: true, personaId: p.personaId, loading: false }) : undefined}
      />

      {/* Formulario crear nuevo usuario */}
      {form !== null && (
        <PersonaForm
          initialData={form}
          onSubmit={handleGuardar}
          loading={formLoading}
          onCancel={() => { setForm(null); setFormError(""); }}
          modoUsuario
          error={formError}
        />
      )}

      {/* Modal editar usuario existente */}
      {editTarget && (
        <UsuarioEditModal
          persona={editTarget}
          onGuardado={() => { setEditTarget(null); cargar(); }}
          onCerrar={() => setEditTarget(null)}
        />
      )}


      <ModalDialog
        open={confirm.open}
        variant="confirm"
        title="Eliminar usuario"
        message={confirm.error || "¿Seguro que deseas eliminar este usuario? La persona también será eliminada."}
        loading={confirm.loading}
        onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, personaId: null, loading: false, error: "" })}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}