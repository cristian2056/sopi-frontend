// Primitivos UI compartidos entre los componentes del UsuarioEditModal

export const S = {
  input: {
    padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db",
    fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box",
  },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" },
  field: { display: "flex", flexDirection: "column" },
  row:   { display: "flex", gap: 10 },
};

export function Field({ label, children, flex }) {
  return (
    <div style={{ ...S.field, flex }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

export function Inp({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      style={S.input}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export function Sel({ value, onChange, children }) {
  return (
    <select style={{ ...S.input, background: "#fff" }} value={value} onChange={onChange}>
      {children}
    </select>
  );
}
