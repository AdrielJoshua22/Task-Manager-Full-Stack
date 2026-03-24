package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.repository.TaskRepository;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class TaskReminderScheduler {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private FcmService fcmService;

    @Autowired
    private UserRepository userRepository;

    @Scheduled(cron = "0 0 8 * * *", zone = "America/Argentina/Buenos_Aires")
    public void sendMorningReminders() {
        Long userId = 1L;
        LocalDate hoy = LocalDate.now();
        List<Task> tasks = taskRepository.findTasksByDateAndFrequency(userId, hoy);

        if (!tasks.isEmpty()) {
            StringBuilder body = new StringBuilder("Hoy tenés: ");
            for (int i = 0; i < tasks.size(); i++) {
                body.append(tasks.get(i).getTitle());
                if (i < tasks.size() - 1) body.append(", ");
            }

            userRepository.findById(userId).ifPresent(user -> {
                if (user.getFcmToken() != null && !user.getFcmToken().isBlank()) {
                    fcmService.sendPushNotification(user.getFcmToken(), "Agenda del día", body.toString());
                }
            });
        }
    }
}