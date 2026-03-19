// src/pages/Equipo/components/FormFoto.jsx
// Formulario para subir una foto: soporta galería y cámara del dispositivo
import React, { useRef, useState } from "react";
import ErrorBanner from "../../../Componentes_react/ui/ErrorBanner";
import { inputStyle, labelStyle } from "../../../Componentes_react/ui/formStyles";

export default function FormFoto({ onGuardar, onCancelar, loading }) {
  const [nombre,       setNombre]       = useState("");
  const [preview,      setPreview]      = useState(null);
  const [archivo,      setArchivo]      = useState(null);
  const [modo,         setModo]         = useState(null);  // "galeria" | "camara"
  const [camaraStream, setCamaraStream] = useState(null);
  const [errorCamara,  setErrorCamara]  = useState("");
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const inputRef  = useRef(null);

  const abrirCamara = async () => {
    setErrorCamara("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCamaraStream(stream);
      setModo("camara");
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch {
      setErrorCamara("No se pudo acceder a la cámara. Verifica los permisos del navegador.");
    }
  };

  const cerrarCamara = () => {
    if (camaraStream) camaraStream.getTracks().forEach(t => t.stop());
    setCamaraStream(null);
    setModo(null);
  };

  const capturarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    fetch(dataUrl).then(r => r.blob()).then(blob => {
      setArchivo(new File([blob], "foto_camara.jpg", { type: "image/jpeg" }));
    });
    cerrarCamara();
  };

  const seleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setModo("galeria");
  };

  const limpiar = () => {
    setPreview(null); setArchivo(null); setModo(null);
    cerrarCamara();
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!archivo) return;
    onGuardar({ archivo, nombre: nombre.trim() || null });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Descripción (opcional)</label>
        <input type="text" placeholder="Ej: Vista frontal, pantalla..."
          value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
      </div>

      {!preview && (
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button type="button" onClick={() => { setModo("galeria"); inputRef.current?.click(); }}
            style={{ flex: 1, padding: "32px 0", borderRadius: 12, border: "2px dashed #d1d5db", background: "#f9fafb", cursor: "pointer", fontSize: "0.93rem", color: "#374151", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "2rem" }}>🖼️</span>
            Seleccionar de galería
          </button>
          <button type="button" onClick={abrirCamara}
            style={{ flex: 1, padding: "32px 0", borderRadius: 12, border: "2px dashed #d1d5db", background: "#f9fafb", cursor: "pointer", fontSize: "0.93rem", color: "#374151", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "2rem" }}>📷</span>
            Tomar foto
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={seleccionarArchivo} style={{ display: "none" }} />

      {errorCamara && <ErrorBanner mensaje={errorCamara} />}

      {modo === "camara" && camaraStream && (
        <div style={{ marginBottom: 16 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 12, background: "#000" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="button" onClick={cerrarCamara}
              style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.93rem" }}>
              Cancelar
            </button>
            <button type="button" onClick={capturarFoto}
              style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.93rem" }}>
              📸 Capturar
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div style={{ marginBottom: 16 }}>
          <img src={preview} alt="Preview"
            style={{ width: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 12, border: "1.5px solid #e5e7eb" }} />
          <button type="button" onClick={limpiar}
            style={{ marginTop: 8, padding: "6px 14px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.85rem", color: "#6b7280" }}>
            ✕ Cambiar foto
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onCancelar}
          style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: "0.93rem", cursor: "pointer", color: "#374151" }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading || !archivo}
          style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: loading || !archivo ? "#9ca3af" : "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.93rem", cursor: loading || !archivo ? "not-allowed" : "pointer" }}>
          {loading ? "Subiendo..." : "Guardar foto"}
        </button>
      </div>
    </form>
  );
}
