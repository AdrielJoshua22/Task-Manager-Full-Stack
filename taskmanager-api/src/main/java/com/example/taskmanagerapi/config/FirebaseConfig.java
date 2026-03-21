package com.example.taskmanagerapi.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) {
                return;
            }

            InputStream serviceAccount;
            String firebaseJson = System.getenv("FIREBASE_CONFIG");

            if (firebaseJson != null && !firebaseJson.isBlank()) {
                serviceAccount = new ByteArrayInputStream(firebaseJson.getBytes(StandardCharsets.UTF_8));
            } else {
                serviceAccount = getClass().getResourceAsStream("/firebase-service-account.json");
                if (serviceAccount == null) {
                    return;
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);

        } catch (IOException e) {
        }
    }
}