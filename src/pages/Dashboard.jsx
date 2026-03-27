// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUsuario, selectEsAdmin, selectEsUsuario } from "../stores/authSlice";
import { equiposApi }       from "../api/equipos.api";
import { ticketsApi }       from "../api/tickets.api";
import { mantenimientosApi } from "../api/mantenimientos.api";
import { personalApi }      from "../api/personal.api";


function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "3px solid rgba(76,115,24,0.15)",
        borderTopColor: "#4c7318",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function KpiCard({ icon, label, value, color, bg, border, sub, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg ?? "rgba(255,255,255,0.7)",
        border: `1.5px solid ${border ?? "rgba(100,151,25,0.18)"}`,
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: hover ? "0 8px 28px rgba(15,40,6,0.13)" : "0 2px 10px rgba(15,40,6,0.06)",
        transform: hover && onClick ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.18s, transform 0.18s",
        cursor: onClick ? "pointer" : "default",
        minWidth: 0,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: bg ?? "rgba(76,115,24,0.1)",
        border: `1px solid ${border ?? "rgba(76,115,24,0.18)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: "1.75rem", color: color ?? "#1a3a0a", lineHeight: 1 }}>
          {value ?? <span style={{ fontSize: "1rem", opacity: 0.5 }}>—</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: "0.82rem", color: color ?? "#4c7318", opacity: 0.85, marginTop: 3 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function SeccionTitulo({ icon, title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontWeight: 800, fontSize: "0.97rem", color: "#1a3a0a", display: "flex", alignItems: "center", gap: 7 }}>
        {icon} {title}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", color: "#4c7318", fontWeight: 700,
          fontSize: "0.8rem", cursor: "pointer", padding: "3px 8px", borderRadius: 6,
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(76,115,24,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {action} →
        </button>
      )}
    </div>
  );
}

function EstadoBadge({ value }) {
  const map = {
    ABIERTO:    { bg: "#dcfce7", color: "#16a34a" },
    EN_PROCESO: { bg: "#fef9c3", color: "#a16207" },
    CERRADO:    { bg: "#f3f4f6", color: "#6b7280" },
    PENDIENTE:  { bg: "#dbeafe", color: "#1d4ed8" },
    PREVENTIVO: { bg: "#dbeafe", color: "#1d4ed8" },
    CORRECTIVO: { bg: "#fee2e2", color: "#dc2626" },
    ACTIVO:     { bg: "#dcfce7", color: "#16a34a" },
    BAJA:       { bg: "#fee2e2", color: "#dc2626" },
  };
  const s = map[(value ?? "").toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 20,
      padding: "2px 9px", fontWeight: 700, fontSize: "0.74rem",
      whiteSpace: "nowrap",
    }}>
      {(value ?? "—").replace("_", " ")}
    </span>
  );
}

function TablaSimple({ cols, rows, keyFn, emptyMsg, loading }) {
  if (loading) return <Spinner />;
  if (!rows?.length) return (
    <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
      {emptyMsg ?? "Sin registros."}
    </div>
  );
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
        <thead>
          <tr style={{ background: "rgba(76,115,24,0.07)", borderBottom: "1.5px solid rgba(76,115,24,0.12)" }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={keyFn ? keyFn(row) : i}
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(248,250,248,0.8)" }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "9px 14px", color: "#374151" }}>
                  {c.render ? c.render(row) : (row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WelcomeBanner({ nombre, rol, color, bg, border, icon }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18,
      padding: "20px 26px",
      background: bg ?? "linear-gradient(135deg, rgba(160,215,68,0.18), rgba(76,115,24,0.12))",
      border: `1.5px solid ${border ?? "rgba(100,151,25,0.22)"}`,
      borderRadius: 18,
      marginBottom: 24,
      boxShadow: "0 2px 14px rgba(15,40,6,0.07)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 15, flexShrink: 0,
        background: "linear-gradient(135deg, #a0d744, #3e5b19)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.6rem",
        boxShadow: "0 4px 16px rgba(76,115,24,0.3)",
      }}>
        {icon ?? "🖥️"}
      </div>
      <div>
        <h2 style={{ margin: "0 0 4px", fontWeight: 800, fontSize: "1.3rem", color: "#1a3a0a" }}>
          Bienvenido, {nombre}
        </h2>
        <p style={{ margin: 0, color: color ?? "#4c7318", fontSize: "0.9rem", fontWeight: 600 }}>
          {rol} · Sistema de Gestión de Parque Informático
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ADMIN ──────────────────────────────────────────────────────────
function DashboardAdmin({ nombre }) {
  const navigate = useNavigate();
  const [equipos,        setEquipos]        = useState([]);
  const [tickets,        setTickets]        = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [personas,       setPersonas]       = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    Promise.allSettled([
      equiposApi.listar(),
      ticketsApi.listar(),
      mantenimientosApi.listar(),
      personalApi.listarPersonas(),
    ]).then(([eq, tk, mn, ps]) => {
      if (eq.status === "fulfilled") setEquipos(eq.value?.datos ?? []);
      if (tk.status === "fulfilled") setTickets(tk.value?.datos ?? []);
      if (mn.status === "fulfilled") setMantenimientos(mn.value?.datos ?? []);
      if (ps.status === "fulfilled") setPersonas(ps.value?.datos ?? []);
      setLoading(false);
    });
  }, []);

  const totalEquipos        = equipos.length;
  const equiposActivos      = equipos.filter(e => (e.estado ?? "").toUpperCase() === "ACTIVO").length;
  const ticketsAbiertos     = tickets.filter(t => (t.estado ?? "").toUpperCase() === "ABIERTO").length;
  const ticketsEnProceso    = tickets.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const mantEnProceso       = mantenimientos.filter(m => (m.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const mantAbiertos        = mantenimientos.filter(m => (m.estado ?? "").toUpperCase() === "ABIERTO").length;
  const totalPersonas       = personas.length;

  const ticketsRecientes    = [...tickets]
    .sort((a, b) => (b.ticketId ?? 0) - (a.ticketId ?? 0)).slice(0, 6);
  const mantRecientes       = [...mantenimientos]
    .sort((a, b) => (b.mantenimientoId ?? 0) - (a.mantenimientoId ?? 0)).slice(0, 5);

  const ACCESOS = [
    { icon: "💻", label: "Equipos",        path: "/equipos",        color: "#4c7318", bg: "rgba(76,115,24,0.08)",  border: "rgba(76,115,24,0.18)"  },
    { icon: "🎫", label: "Tickets",         path: "/tickets",        color: "#2563eb", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.18)"  },
    { icon: "🔧", label: "Mantenimientos",  path: "/mantenimientos", color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.18)"  },
    { icon: "👥", label: "Personal",        path: "/personal",       color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.18)" },
    { icon: "🏢", label: "Dependencias",    path: "/dependencias",   color: "#0891b2", bg: "rgba(8,145,178,0.08)",  border: "rgba(8,145,178,0.18)"  },
    { icon: "🔑", label: "Usuarios",        path: "/usuarios",       color: "#be185d", bg: "rgba(190,24,93,0.08)",  border: "rgba(190,24,93,0.18)"  },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      <WelcomeBanner nombre={nombre} rol="Administrador" icon="🛡️"
        color="#1d4ed8" bg="linear-gradient(135deg,rgba(37,99,235,0.1),rgba(76,115,24,0.08))"
        border="rgba(37,99,235,0.2)" />

      {/* KPIs */}
      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          <KpiCard icon="💻" label="Equipos totales" value={totalEquipos}
            sub={`${equiposActivos} activos`}
            color="#4c7318" bg="rgba(76,115,24,0.07)" border="rgba(76,115,24,0.18)"
            onClick={() => navigate("/equipos")} />
          <KpiCard icon="🎫" label="Tickets abiertos" value={ticketsAbiertos}
            sub={`${ticketsEnProceso} en proceso`}
            color="#2563eb" bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)"
            onClick={() => navigate("/tickets")} />
          <KpiCard icon="🔧" label="Mantenimientos" value={mantAbiertos + mantEnProceso}
            sub={`${mantEnProceso} en proceso`}
            color="#d97706" bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)"
            onClick={() => navigate("/mantenimientos")} />
          <KpiCard icon="👥" label="Personal registrado" value={totalPersonas}
            color="#7c3aed" bg="rgba(124,58,237,0.07)" border="rgba(124,58,237,0.18)"
            onClick={() => navigate("/personal")} />
        </div>
      )}

      {/* Accesos rápidos */}
      <div style={{
        background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
        border: "1.5px solid rgba(100,151,25,0.14)",
        borderRadius: 16, padding: "20px 22px", marginBottom: 24,
        boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
      }}>
        <SeccionTitulo icon="⚡" title="Acceso rápido" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {ACCESOS.map(a => {
            const [h, setH] = useState(false);
            return (
              <button key={a.path} onClick={() => navigate(a.path)}
                onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  padding: "16px 10px", borderRadius: 12,
                  background: h ? a.bg : "rgba(255,255,255,0.5)",
                  border: `1.5px solid ${h ? a.border : "rgba(0,0,0,0.07)"}`,
                  cursor: "pointer", transition: "all 0.15s",
                  transform: h ? "translateY(-2px)" : "none",
                  boxShadow: h ? `0 4px 16px ${a.bg}` : "none",
                }}>
                <span style={{ fontSize: "1.4rem" }}>{a.icon}</span>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: h ? a.color : "#374151" }}>
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tablas recientes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Tickets recientes */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(37,99,235,0.14)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="🎫" title="Tickets recientes" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple
            loading={loading}
            keyFn={t => t.ticketId}
            emptyMsg="No hay tickets."
            cols={[
              { key: "ticketId", label: "#", render: t => `#${t.ticketId}` },
              { key: "descripcion", label: "Descripción", render: t => (t.descripcion?.substring(0, 35) ?? "—") + (t.descripcion?.length > 35 ? "…" : "") },
              { key: "estado", label: "Estado", render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={ticketsRecientes}
          />
        </div>

        {/* Mantenimientos recientes */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(217,119,6,0.18)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="🔧" title="Mantenimientos recientes" action="Ver todos" onAction={() => navigate("/mantenimientos")} />
          <TablaSimple
            loading={loading}
            keyFn={m => m.mantenimientoId}
            emptyMsg="No hay mantenimientos."
            cols={[
              { key: "mantenimientoId", label: "#", render: m => `#${m.mantenimientoId}` },
              { key: "tipoMantenimiento", label: "Tipo", render: m => <EstadoBadge value={m.tipoMantenimiento} /> },
              { key: "estado", label: "Estado", render: m => <EstadoBadge value={m.estado} /> },
            ]}
            rows={mantRecientes}
          />
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD TÉCNICO ────────────────────────────────────────────────────────
function DashboardTecnico({ nombre }) {
  const navigate = useNavigate();
  const [pendientes,    setPendientes]    = useState([]);
  const [asignados,     setAsignados]     = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [tomandoId,     setTomandoId]     = useState(null);
  const [msg,           setMsg]           = useState(null);

  const cargar = () => {
    setLoading(true);
    Promise.allSettled([
      ticketsApi.pendientes(),
      ticketsApi.misAsignados(),
      mantenimientosApi.listar(),
    ]).then(([pe, as, mn]) => {
      if (pe.status === "fulfilled") setPendientes(pe.value?.datos ?? []);
      if (as.status === "fulfilled") setAsignados(as.value?.datos ?? []);
      if (mn.status === "fulfilled") {
        const todos = mn.value?.datos ?? [];
        setMantenimientos(todos.filter(m => (m.estado ?? "").toUpperCase() !== "CERRADO").slice(0, 6));
      }
      setLoading(false);
    });
  };

  useEffect(() => { cargar(); }, []);

  const handleTomar = async (ticketId) => {
    setTomandoId(ticketId);
    try {
      const res = await ticketsApi.tomar(ticketId);
      if (res?.exito === false) throw new Error(res.mensaje);
      setMsg({ ok: true, text: "Ticket tomado correctamente." });
      cargar();
    } catch (e) {
      setMsg({ ok: false, text: e.message || "No se pudo tomar el ticket." });
    } finally {
      setTomandoId(null);
      setTimeout(() => setMsg(null), 3500);
    }
  };

  const misPendientes  = pendientes.length;
  const misAsignados   = asignados.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const misCerrados    = asignados.filter(t => (t.estado ?? "").toUpperCase() === "CERRADO").length;
  const mantAsignados  = mantenimientos.length;

  return (
    <div style={{ maxWidth: 1050 }}>
      <WelcomeBanner nombre={nombre} rol="Técnico" icon="🔧"
        color="#d97706" bg="linear-gradient(135deg,rgba(217,119,6,0.1),rgba(76,115,24,0.07))"
        border="rgba(217,119,6,0.2)" />

      {msg && (
        <div style={{
          marginBottom: 16, padding: "12px 18px", borderRadius: 10,
          background: msg.ok ? "#dcfce7" : "#fee2e2",
          color: msg.ok ? "#16a34a" : "#dc2626",
          border: `1px solid ${msg.ok ? "#86efac" : "#fca5a5"}`,
          fontWeight: 600, fontSize: "0.88rem",
        }}>
          {msg.ok ? "✅" : "❌"} {msg.text}
        </div>
      )}

      {/* KPIs */}
      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 26 }}>
          <KpiCard icon="📬" label="Tickets pendientes" value={misPendientes}
            sub="Sin asignar"
            color="#2563eb" bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)" />
          <KpiCard icon="⚙️" label="Mis tickets activos" value={misAsignados}
            sub="En proceso"
            color="#d97706" bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)" />
          <KpiCard icon="✅" label="Tickets cerrados" value={misCerrados}
            sub="Por mí"
            color="#16a34a" bg="rgba(22,163,74,0.07)" border="rgba(22,163,74,0.18)" />
          <KpiCard icon="🔧" label="Mantenimientos activos" value={mantAsignados}
            sub="Abiertos / En proceso"
            color="#7c3aed" bg="rgba(124,58,237,0.07)" border="rgba(124,58,237,0.18)"
            onClick={() => navigate("/mantenimientos")} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Tickets pendientes para tomar */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(37,99,235,0.18)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="📬" title="Tickets disponibles" action="Ver todos" onAction={() => navigate("/tickets")} />
          {loading ? <Spinner /> : pendientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
              No hay tickets pendientes 🎉
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
              {pendientes.slice(0, 8).map(t => (
                <div key={t.ticketId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)",
                  borderRadius: 10, padding: "10px 14px", gap: 10,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1e3a5f" }}>
                      #{t.ticketId} — {(t.descripcion ?? "Sin descripción").substring(0, 40)}{(t.descripcion?.length ?? 0) > 40 ? "…" : ""}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
                      {t.equipo?.nombre ?? t.equipoNombre ?? "Equipo no especificado"}
                    </div>
                  </div>
                  <button
                    disabled={tomandoId === t.ticketId}
                    onClick={() => handleTomar(t.ticketId)}
                    style={{
                      background: "#2563eb", color: "#fff", border: "none",
                      borderRadius: 8, padding: "6px 12px", fontWeight: 700,
                      fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap",
                      opacity: tomandoId === t.ticketId ? 0.6 : 1,
                    }}>
                    {tomandoId === t.ticketId ? "…" : "Tomar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis tickets asignados */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(217,119,6,0.18)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="⚙️" title="Mis tickets asignados" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple
            loading={loading}
            keyFn={t => t.ticketId}
            emptyMsg="No tienes tickets asignados."
            cols={[
              { key: "ticketId", label: "#", render: t => `#${t.ticketId}` },
              { key: "descripcion", label: "Descripción", render: t => (t.descripcion?.substring(0, 30) ?? "—") + (t.descripcion?.length > 30 ? "…" : "") },
              { key: "estado", label: "Estado", render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={asignados.slice(0, 6)}
          />
        </div>
      </div>

      {/* Mantenimientos activos */}
      <div style={{
        background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
        border: "1.5px solid rgba(124,58,237,0.15)", borderRadius: 16,
        padding: "18px 20px", marginTop: 18,
        boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
      }}>
        <SeccionTitulo icon="🔧" title="Mantenimientos activos" action="Ver todos" onAction={() => navigate("/mantenimientos")} />
        <TablaSimple
          loading={loading}
          keyFn={m => m.mantenimientoId}
          emptyMsg="No hay mantenimientos activos."
          cols={[
            { key: "mantenimientoId", label: "#",         render: m => `#${m.mantenimientoId}` },
            { key: "tipoMantenimiento", label: "Tipo",    render: m => <EstadoBadge value={m.tipoMantenimiento} /> },
            { key: "descripcion", label: "Descripción",   render: m => (m.descripcion?.substring(0, 45) ?? "—") + (m.descripcion?.length > 45 ? "…" : "") },
            { key: "estado", label: "Estado",             render: m => <EstadoBadge value={m.estado} /> },
            { key: "fechaProgramada", label: "Fecha",     render: m => m.fechaProgramada ?? "—" },
          ]}
          rows={mantenimientos}
        />
      </div>
    </div>
  );
}

// ─── DASHBOARD USUARIO ────────────────────────────────────────────────────────
function DashboardUsuario({ nombre }) {
  const navigate = useNavigate();
  const [misEquipos,  setMisEquipos]  = useState([]);
  const [misTickets,  setMisTickets]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.allSettled([
      ticketsApi.misEquipos(),
      ticketsApi.misTickets(),
    ]).then(([eq, tk]) => {
      if (eq.status === "fulfilled") setMisEquipos(eq.value?.datos ?? []);
      if (tk.status === "fulfilled") setMisTickets(tk.value?.datos ?? []);
      setLoading(false);
    });
  }, []);

  const totalEquipos     = misEquipos.length;
  const ticketsAbiertos  = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "ABIERTO").length;
  const ticketsEnProceso = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const ticketsCerrados  = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "CERRADO").length;

  const ticketsRecientes = [...misTickets].sort((a, b) => (b.ticketId ?? 0) - (a.ticketId ?? 0)).slice(0, 5);

  return (
    <div style={{ maxWidth: 900 }}>
      <WelcomeBanner nombre={nombre} rol="Usuario" icon="🖥️" />

      {/* KPIs */}
      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 14, marginBottom: 26 }}>
          <KpiCard icon="🖥️" label="Mis equipos" value={totalEquipos}
            color="#4c7318" bg="rgba(76,115,24,0.07)" border="rgba(76,115,24,0.18)"
            onClick={() => navigate("/mis-equipos")} />
          <KpiCard icon="🎫" label="Tickets abiertos" value={ticketsAbiertos}
            color="#2563eb" bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)"
            onClick={() => navigate("/tickets")} />
          <KpiCard icon="⚙️" label="Tickets en proceso" value={ticketsEnProceso}
            color="#d97706" bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)"
            onClick={() => navigate("/tickets")} />
          <KpiCard icon="✅" label="Tickets cerrados" value={ticketsCerrados}
            color="#16a34a" bg="rgba(22,163,74,0.07)" border="rgba(22,163,74,0.18)"
            onClick={() => navigate("/tickets")} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Mis equipos */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(76,115,24,0.18)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="🖥️" title="Mis equipos" action="Ver todos" onAction={() => navigate("/mis-equipos")} />
          {loading ? <Spinner /> : misEquipos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
              No tienes equipos asignados.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {misEquipos.map(eq => (
                <div key={eq.equipoId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(76,115,24,0.04)", border: "1px solid rgba(76,115,24,0.12)",
                  borderRadius: 10, padding: "10px 14px",
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a3a0a" }}>
                      {eq.nombre ?? `Equipo #${eq.equipoId}`}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 1 }}>
                      {eq.tipoActivo ?? ""}{eq.marca ? ` · ${eq.marca}` : ""}
                    </div>
                  </div>
                  <EstadoBadge value={eq.estado ?? "ACTIVO"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis tickets recientes */}
        <div style={{
          background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(37,99,235,0.18)", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
        }}>
          <SeccionTitulo icon="🎫" title="Mis tickets recientes" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple
            loading={loading}
            keyFn={t => t.ticketId}
            emptyMsg="No has creado tickets aún."
            cols={[
              { key: "ticketId",    label: "#",       render: t => `#${t.ticketId}` },
              { key: "descripcion", label: "Motivo",  render: t => (t.descripcion?.substring(0, 28) ?? "—") + ((t.descripcion?.length ?? 0) > 28 ? "…" : "") },
              { key: "estado",      label: "Estado",  render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={ticketsRecientes}
          />
        </div>
      </div>

      {/* Botón de ayuda */}
      <div style={{
        marginTop: 20, padding: "18px 22px",
        background: "rgba(255,255,255,0.6)",
        border: "1.5px solid rgba(100,151,25,0.15)",
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a3a0a", marginBottom: 3 }}>
            ¿Tienes un problema con tu equipo?
          </div>
          <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Abre un ticket de soporte y un técnico se encargará.
          </div>
        </div>
        <button onClick={() => navigate("/tickets")} style={{
          background: "linear-gradient(135deg, #4c7318, #3e5b19)",
          color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px",
          fontWeight: 800, fontSize: "0.9rem", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(76,115,24,0.3)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          🎫 Abrir ticket
        </button>
      </div>
    </div>
  );
}

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const usuario   = useSelector(selectUsuario);
  const nombre    = usuario?.nombreCompleto ?? "Usuario";
  const esAdmin   = useSelector(selectEsAdmin);
  const esUsuario = useSelector(selectEsUsuario);

  if (esAdmin)   return <DashboardAdmin   nombre={nombre} />;
  if (esUsuario) return <DashboardUsuario nombre={nombre} />;
  return           <DashboardTecnico nombre={nombre} />;
}
