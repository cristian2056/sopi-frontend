// src/pages/Dashboard.jsx
import { useSelector } from "react-redux";
import { selectUsuario, selectEsAdmin, selectEsUsuario } from "../stores/authSlice";
import DashboardAdmin   from "./Dashboard/DashboardAdmin";
import DashboardTecnico from "./Dashboard/DashboardTecnico";
import DashboardUsuario from "./Dashboard/DashboardUsuario";

export default function Dashboard() {
  const usuario   = useSelector(selectUsuario);
  const nombre    = usuario?.nombreCompleto ?? "Usuario";
  const esAdmin   = useSelector(selectEsAdmin);
  const esUsuario = useSelector(selectEsUsuario);

  if (esAdmin)   return <DashboardAdmin   nombre={nombre} />;
  if (esUsuario) return <DashboardUsuario nombre={nombre} />;
  return           <DashboardTecnico nombre={nombre} />;
}
