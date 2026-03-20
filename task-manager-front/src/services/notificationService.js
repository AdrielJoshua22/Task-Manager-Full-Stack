import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

export const solicitarPermisosYGuardarToken = async (username) => {
  try {

    const permiso = await Notification.requestPermission();

    if (permiso === "granted") {
      console.log("Permiso concedido. Obteniendo token de Google...");

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        window.miTokenReal = token; // Esto lo deja "flotando" en la consola
        console.log("TOKEN LISTO EN: window.miTokenReal");
      });

      if (token) {

        const response = await fetch(`https://task-manager-full-stack-production.up.railway.app/api/tasks/user/${username}/fcm-token`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token })
        });

        if (response.ok) {
          console.log("Token guardado en Railway correctamente");
        }
      }
    } else {
      console.warn("El usuario rechazó las notificaciones");
    }
  } catch (error) {
    console.error("Error en el flujo de notificaciones:", error);
  }
};