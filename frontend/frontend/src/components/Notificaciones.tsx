import { useState, useEffect, useRef } from "react";
import notiIcon from "../assets/noti.png";
import { useNavigate } from "react-router-dom";

interface Notificacion {
  ID_NOTIFICACION: number;
  MENSAJE: string;
  FECHA?: string;
}

interface NotificacionesProps {
  idEmpleado: number | null;
}

export default function Notificaciones({ idEmpleado }: NotificacionesProps) {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showNoti, setShowNoti] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const leidasStorageKey = "notificacionesLeidas";
  const notificacionesLeidas: number[] = JSON.parse(localStorage.getItem(leidasStorageKey) || "[]");

  const fetchNotificaciones = async () => {
    if (!idEmpleado) return;
    try {
      const res = await fetch(`http://localhost:4000/api/notificaciones/${idEmpleado}`);
      if (!res.ok) throw new Error("Error al obtener notificaciones");
      const data = await res.json();
      const pendientes = data.filter(
        (n: Notificacion) => !notificacionesLeidas.includes(n.ID_NOTIFICACION)
      );
      setNotificaciones(pendientes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000);
    return () => clearInterval(interval);
  }, [idEmpleado]);

  const marcarLeida = (id: number) => {
    const nuevasLeidas = [...notificacionesLeidas, id];
    localStorage.setItem(leidasStorageKey, JSON.stringify(nuevasLeidas));
    setNotificaciones(notificaciones.filter((n) => n.ID_NOTIFICACION !== id));
  };

  const notiNoLeidas = notificaciones.length;

  const handleIrEncuesta = (casoId: string) => {
    localStorage.setItem("casoEncuesta", JSON.stringify({ id_caso: casoId }));
    navigate(`/dashboard/calificar-servicio/${casoId}`);
  };

  const handleVerDetalle = (casoId: string) => {
    localStorage.setItem("casoDetalle", JSON.stringify({ id_caso: casoId }));
    navigate("/dashboard/detalle-caso", { replace: true });
    window.dispatchEvent(new Event("cambioCaso"));
  };

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNoti(false);
      }
    };
    if (showNoti) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNoti]);

  return (
    <div style={{ position: "relative" }}>
      <button className="noti-button" onClick={() => setShowNoti(!showNoti)}>
        <img src={notiIcon} alt="Notificaciones" className="noti-icon" />
        <span className="noti-badge">{notiNoLeidas}</span>
      </button>

      {showNoti && (
        <div
          ref={panelRef}
          className="noti-panel"
          style={{
            position: "absolute",
            top: "60px",
            right: 0,
            width: "420px",
            maxHeight: "550px",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            borderRadius: "16px",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(90deg, #198754, #20c997)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            <span>🔔 Notificaciones</span>
            {notificaciones.length > 0 && (
              <button
                onClick={() => {
                  const todas = notificaciones.map((n) => n.ID_NOTIFICACION);
                  localStorage.setItem(
                    leidasStorageKey,
                    JSON.stringify([...notificacionesLeidas, ...todas])
                  );
                  setNotificaciones([]);
                }}
                style={{
                  border: "none",
                  background: "#dc3545",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                }}
              >
                Limpiar todas
              </button>
            )}
          </div>

          <div
            style={{
              padding: "14px",
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backgroundColor: "#f9fafb",
            }}
          >
            {notificaciones.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                  margin: "30px 0",
                }}
              >
                No hay notificaciones nuevas
              </p>
            ) : (
              notificaciones.map((n) => {
                const idMatch = n.MENSAJE.match(/ID (\d+)/);
                const casoId = idMatch ? idMatch[1] : null;
                const partesMensaje = casoId ? n.MENSAJE.split(`ID ${casoId}`) : [n.MENSAJE];

                return (
                  <div
                    key={n.ID_NOTIFICACION}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "14px",
                      padding: "14px 18px",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      borderLeft: "4px solid #198754",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#212529",
                          lineHeight: "1.4",
                        }}
                      >
                        {casoId ? (
                          <>
                            <span
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "#198754",
                              }}
                              onClick={() => handleVerDetalle(casoId)}
                            >
                              {`Tu caso con ID ${casoId}`}
                            </span>
                            {partesMensaje[1]}
                          </>
                        ) : (
                          n.MENSAJE
                        )}
                      </p>
                      <small style={{ color: "#6c757d", fontSize: "11px" }}>
                        {n.FECHA ? new Date(n.FECHA).toLocaleString() : ""}
                      </small>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "6px",
                      }}
                    >
                      <button
                        onClick={() => marcarLeida(n.ID_NOTIFICACION)}
                        style={{
                          border: "none",
                          background: "#ef5350",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "12px",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🗑️ Eliminar
                      </button>

                      <button
                        onClick={() => {
                          if (casoId) handleIrEncuesta(casoId);
                        }}
                        style={{
                          border: "none",
                          background: "#198754",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "12px",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ⭐ Calificar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
