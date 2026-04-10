// src/hooks/useSignalR.js
// Inicializa/destruye la conexión SignalR según el estado de auth.
// Úsalo UNA vez en App.jsx; el resto de componentes
// suscriben eventos directamente con onSignalR().
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectIsAuthenticated } from "../stores/authSlice";
import { conectarSignalR, desconectarSignalR } from "../services/signalrService";

export function useSignalR() {
  const token      = useSelector(selectToken);
  const autenticado = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (autenticado && token) {
      conectarSignalR(token);
    } else {
      desconectarSignalR();
    }
    // Desconectar al desmontar (cierre de pestaña / logout)
    return () => { desconectarSignalR(); };
  }, [autenticado, token]);
}
