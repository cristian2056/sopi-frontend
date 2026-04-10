// src/services/signalrService.js
// Singleton que gestiona la conexión SignalR con el backend.
// Se conecta una sola vez y re-emite eventos a los suscriptores.
import * as signalR from "@microsoft/signalr";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

let connection = null;
const listeners = {};   // { evento: Set<fn> }

function emit(evento, data) {
  listeners[evento]?.forEach(fn => fn(data));
}

/** Suscribirse a un evento SignalR. Devuelve función de unsuscribe. */
export function onSignalR(evento, fn) {
  if (!listeners[evento]) listeners[evento] = new Set();
  listeners[evento].add(fn);
  return () => listeners[evento].delete(fn);
}

/** Conecta al hub usando el JWT del usuario logueado. */
export async function conectarSignalR(token) {
  if (connection) return;                       // ya conectado

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hubs/notificaciones`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // Reenviar eventos del hub a los suscriptores locales
  connection.on("notif",        data => emit("notif", data));
  connection.on("ticketCambio", ()   => emit("ticketCambio", null));

  try {
    await connection.start();
    console.info("[SignalR] Conectado");
  } catch (err) {
    console.warn("[SignalR] Error al conectar:", err);
    connection = null;
  }
}

/** Desconecta (al hacer logout). */
export async function desconectarSignalR() {
  if (!connection) return;
  try { await connection.stop(); } catch {}
  connection = null;
  // Limpiar listeners
  Object.keys(listeners).forEach(k => listeners[k].clear());
  console.info("[SignalR] Desconectado");
}
