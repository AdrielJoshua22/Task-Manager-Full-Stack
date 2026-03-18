package com.example.taskmanagerapi.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FcmService {

    public void sendPushNotification(String token, String title, String body) {
        if (token == null || token.isBlank()) {
            System.err.println("No se puede enviar notificación: El usuario no tiene un FCM Token registrado.");
            return;
        }

        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(notification)
                    .putData("click_action", "FLUTTER_NOTIFICATION_CLICK") // Opcional: para manejar clicks
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Notificación enviada con éxito. ID de respuesta: " + response);

        } catch (Exception e) {
            System.err.println("Error enviando notificación push a Firebase: " + e.getMessage());
        }
    }
}