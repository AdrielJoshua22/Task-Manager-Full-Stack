package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.repository.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class TaskReminderScheduler {

    private final TaskRepository taskRepository;
    private final FcmService fcmService;

    public TaskReminderScheduler(TaskRepository taskRepository, FcmService fcmService) {
        this.taskRepository = taskRepository;
        this.fcmService = fcmService;
    }
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDailyTasksAndNotify() {
        LocalDate hoy = LocalDate.now();
        List<Task> tareasDeHoy = taskRepository.findTasksByDateAndFrequency(null, hoy);

        for (Task task : tareasDeHoy) {
            if (task.getUser() != null && task.getUser().getFcmToken() != null) {
                String title = "📌 Recordatorio de Tarea";
                String body = "No te olvides de: " + task.getTitle();

                fcmService.sendPushNotification(
                        task.getUser().getFcmToken(),
                        title,
                        body
                );
            }
        }
    }
}
