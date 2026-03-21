package com.example.taskmanagerapi.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FcmService {

    public void sendPushNotification(String token, String title, String body) {
        if (token == null || token.isBlank()) {
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
                    .build();

            FirebaseMessaging.getInstance().send(message);

        } catch (Exception e) {
            return;
        }
    }
}