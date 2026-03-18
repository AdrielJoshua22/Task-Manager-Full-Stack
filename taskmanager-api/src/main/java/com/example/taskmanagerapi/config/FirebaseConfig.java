package com.example.taskmanagerapi.config;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
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

            if (firebaseJson != null && !firebaseJson.isEmpty()) {
                serviceAccount = new ByteArrayInputStream(firebaseJson.getBytes(StandardCharsets.UTF_8));
                System.out.println("Firebase inicializado desde Railway (Variable de Entorno)");
            } else {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");

                if (serviceAccount == null) {
                    System.err.println("ERROR: No se encontró la configuración de Firebase.");
                    return;
                }
                System.out.println("💻 Firebase inicializado desde archivo local (Modo Desarrollo)");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);

        } catch (IOException e) {
            System.err.println("❌ Error crítico al inicializar Firebase: " + e.getMessage());
        }
    }
}