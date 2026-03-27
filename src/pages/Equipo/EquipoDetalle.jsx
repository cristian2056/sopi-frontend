// src/pages/Equipo/EquipoDetalle.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { equiposApi } from "../../api/equipos.api";
import { usePermiso } from "../../stores/menuSlice";
import TabInfoGeneral from "./tabs/TabInfoGeneral";
import TabComponentes from "./tabs/TabComponentes";
import TabSoftware    from "./tabs/TabSoftware";
import TabRed         from "./tabs/TabRed";
import TabFotos       from "./tabs/TabFotos";
import TabAsignacion  from "./tabs/TabAsignacion";
import TabHistorial    from "./tabs/TabHistorial";

const TABS = [
  { key: "info",        label: "📋 Info General" },
  { key: "componentes", label: "🔧 Componentes"  },
  { key: "software",    label: "💿 Software"      },
  { key: "red",         label: "🌐 Red"           },
  { key: "fotos",       label: "📷 Fotos"         },
  { key: "asignacion",  label: "👤 Asignación"    },
  { key: "historial",   label: "📜 Historial"     },
];

function ModalPdf({ blobUrl, nombre, onClose, onDescargar, descargando }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(960px, 95vw)", height: "90vh",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid #e5e7eb",
          background: "linear-gradient(135deg, rgba(76,115,24,0.06), rgba(220,38,38,0.04))",
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a3a0a" }}>
            📄 Vista previa — {nombre}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={descargando}
              onClick={onDescargar}
              style={{
                background: descargando ? "#9ca3af" : "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "6px 14px", fontWeight: 700, fontSize: "0.82rem",
                cursor: descargando ? "not-allowed" : "pointer",
              }}
            >
              {descargando ? "⏳ Descargando…" : "⬇️ Descargar"}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 8,
                padding: "6px 12px", cursor: "pointer", fontSize: "1rem", color: "#6b7280",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* iframe */}
        <iframe
          src={blobUrl}
          title="Vista previa PDF"
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      </div>
    </div>
  );
}

export default function EquipoDetalle() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { crear, modificar, eliminar } = usePermiso("Equipos");
  const [equipo,    setEquipo]   = useState(null);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [tabActiva, setTabActiva] = useState("info");

  // PDF
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [pdfError,    setPdfError]    = useState(null);
  const [previewUrl,  setPreviewUrl]  = useState(null);   // blob URL activa
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await equiposApi.obtener(id);
        if (data.exito) setEquipo(data.datos);
        else setError(data.mensaje || "No se pudo cargar el equipo.");
      } catch (e) {
        setError(e.message || "Error de conexión.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  // Limpiar blob URL al desmontar
  useEffect(() => {
    return () => { if (previewUrl) window.URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const abrirPreview = useCallback(async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      // Si ya tenemos una URL cacheada la reutilizamos
      const url = previewUrl ?? await equiposApi.obtenerBlobUrlPdf(id);
      if (!previewUrl) setPreviewUrl(url);
      setPreviewOpen(true);
    } catch (e) {
      setPdfError(e.message || "No se pudo generar la vista previa.");
    } finally {
      setPdfLoading(false);
    }
  }, [id, previewUrl]);

  const cerrarPreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const descargarDesdeModal = useCallback(async () => {
    setPdfLoading(true);
    try {
      await equiposApi.descargarPdf(id, equipo?.codigoPatrimonial);
    } catch (e) {
      setPdfError(e.message || "No se pudo descargar el PDF.");
    } finally {
      setPdfLoading(false);
    }
  }, [id, equipo]);

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Cargando equipo...</div>;

  if (error) return (
    <div style={{ padding: 40 }}>
      <div style={{ color: "#dc2626", marginBottom: 16 }}>{error}</div>
      <button onClick={() => navigate("/equipos")}
        style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
        ← Volver a equipos
      </button>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>

      <div className="page-toolbar" style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/equipos")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#4c7318", padding: "0 4px" }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            {equipo.nombre ?? equipo.codigoPatrimonial}
          </h2>
          <span style={{ color: "#649719", fontSize: "0.85rem", fontWeight: 500 }}>
            Cód. Patrimonial: {equipo.codigoPatrimonial}
            {equipo.serial ? ` · Serial: ${equipo.serial}` : ""}
          </span>
        </div>
        <span style={{
          padding: "4px 14px", borderRadius: 20,
          background: equipo.activo ? "rgba(220,252,231,0.8)" : "rgba(254,226,226,0.8)",
          color: equipo.activo ? "#16a34a" : "#dc2626",
          fontWeight: 700, fontSize: "0.83rem",
          border: `1px solid ${equipo.activo ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
        }}>
          {equipo.estado}
        </span>

        {/* Botón Vista Previa */}
        <button
          disabled={pdfLoading}
          onClick={abrirPreview}
          title="Ver hoja de inventario"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: pdfLoading ? "#9ca3af" : "rgba(220,38,38,0.1)",
            color: pdfLoading ? "#fff" : "#b91c1c",
            border: "1.5px solid rgba(220,38,38,0.3)", borderRadius: 10,
            padding: "7px 14px", fontWeight: 700, fontSize: "0.85rem",
            cursor: pdfLoading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { if (!pdfLoading) e.currentTarget.style.background = "rgba(220,38,38,0.18)"; }}
          onMouseLeave={e => { if (!pdfLoading) e.currentTarget.style.background = "rgba(220,38,38,0.1)"; }}
        >
          {pdfLoading ? "⏳ Cargando…" : "👁️ Ver PDF"}
        </button>

        {/* Botón Descargar */}
        <button
          disabled={pdfLoading}
          onClick={descargarDesdeModal}
          title="Descargar hoja de inventario en PDF"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: pdfLoading ? "#9ca3af" : "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "7px 16px", fontWeight: 700, fontSize: "0.85rem",
            cursor: pdfLoading ? "not-allowed" : "pointer",
            boxShadow: pdfLoading ? "none" : "0 3px 10px rgba(220,38,38,0.3)",
            transition: "transform 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { if (!pdfLoading) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          {pdfLoading ? "⏳ Generando…" : "📄 Descargar PDF"}
        </button>
      </div>

      {/* Error PDF */}
      {pdfError && (
        <div style={{
          marginBottom: 14, padding: "10px 16px", borderRadius: 10,
          background: "#fee2e2", color: "#dc2626",
          border: "1px solid #fca5a5", fontSize: "0.85rem", fontWeight: 600,
        }}>
          ❌ {pdfError}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid rgba(100,151,25,0.2)", marginBottom: 20, overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setTabActiva(tab.key)}
            style={{
              padding: "9px 16px", border: "none",
              borderBottom: tabActiva === tab.key ? "3px solid #4c7318" : "3px solid transparent",
              background: tabActiva === tab.key ? "rgba(160,215,68,0.12)" : "none",
              cursor: "pointer",
              fontWeight: tabActiva === tab.key ? 700 : 500,
              color: tabActiva === tab.key ? "#3e5b19" : "#6b7280",
              fontSize: "0.9rem", marginBottom: -2, whiteSpace: "nowrap",
              borderRadius: "8px 8px 0 0",
              transition: "background 0.15s, color 0.15s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabActiva === "info"        && <TabInfoGeneral  equipo={equipo} equipoId={id} onActualizado={setEquipo} modificar={modificar} />}
        {tabActiva === "componentes" && <TabComponentes  equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "software"    && <TabSoftware     equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "red"         && <TabRed          equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "fotos"       && <TabFotos        equipoId={id} crear={crear} eliminar={eliminar} />}
        {tabActiva === "asignacion"  && <TabAsignacion   equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "historial"   && <TabHistorial    equipoId={id} />}
      </div>

      {/* Modal Vista Previa PDF */}
      {previewOpen && previewUrl && (
        <ModalPdf
          blobUrl={previewUrl}
          nombre={`HojaInventario-${equipo.codigoPatrimonial}`}
          onClose={cerrarPreview}
          onDescargar={descargarDesdeModal}
          descargando={pdfLoading}
        />
      )}
    </div>
  );
}
