import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig";

const isLocal = window.location.hostname === 'localhost';
const API_BASE_URL = isLocal
  ? 'http://localhost:8080/api/tasks'
  : 'https://task-manager-full-stack-production.up.railway.app/api/tasks';

export const solicitarPermisosYGuardarToken = async (username) => {
  try {
    const permiso = await Notification.requestPermission();

    if (permiso === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BEhReQV1C2-SSLbBiJ1gZ69C7NBEJW_9U6_mbGSF8ZbTQWEKWnMpUaivY-9_tu1AeLRiPfOUGV3u95P3QVwXlBw"
      });

      if (token) {
        window.miTokenReal = token;

        await fetch(`${API_BASE_URL}/user/${username}/fcm-token`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token })
        });

        onMessage(messaging, (payload) => {
          const title = payload.notification?.title || "Task Manager";
          const options = {
            body: payload.notification?.body || "Tienes una nueva actualización.",
            icon: '/logo192.png'
          };

          new Notification(title, options);
        });
      }
    }
  } catch (error) {
  }
};