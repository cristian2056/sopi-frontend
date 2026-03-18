import { Field, Inp, Sel, S } from "./ModalFormUI";

const TIPOS_DOC = ["DNI", "CE", "PASAPORTE"];
const SEXOS     = ["M", "F"];

export default function TabPersonaEdit({ datos, set }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      <div style={S.row}>
        <Field label="Tipo doc." flex="0 0 120px">
          <Sel value={datos.tipoDocumento} onChange={e => set("tipoDocumento", e.target.value)}>
            {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
          </Sel>
        </Field>
        <Field label="Nº documento *" flex={1}>
          <Inp value={datos.numeroDocumento} onChange={e => set("numeroDocumento", e.target.value)} />
        </Field>
        <Field label="Sexo" flex="0 0 90px">
          <Sel value={datos.sexo} onChange={e => set("sexo", e.target.value)}>
            <option value="">-</option>
            {SEXOS.map(s => <option key={s}>{s}</option>)}
          </Sel>
        </Field>
      </div>

      <Field label="Nombres *">
        <Inp value={datos.nombres} onChange={e => set("nombres", e.target.value)} />
      </Field>

      <div style={S.row}>
        <Field label="Apellido paterno" flex={1}>
          <Inp value={datos.apellidosPaterno} onChange={e => set("apellidosPaterno", e.target.value)} />
        </Field>
        <Field label="Apellido materno" flex={1}>
          <Inp value={datos.apellidosMaterno} onChange={e => set("apellidosMaterno", e.target.value)} />
        </Field>
      </div>

      <div style={S.row}>
        <Field label="Email" flex={1}>
          <Inp type="email" value={datos.email} onChange={e => set("email", e.target.value)} />
        </Field>
        <Field label="Teléfono" flex={1}>
          <Inp value={datos.telefono} onChange={e => set("telefono", e.target.value)} />
        </Field>
      </div>

      <Field label="Dirección">
        <Inp value={datos.direccion} onChange={e => set("direccion", e.target.value)} />
      </Field>

    </div>
  );
}
