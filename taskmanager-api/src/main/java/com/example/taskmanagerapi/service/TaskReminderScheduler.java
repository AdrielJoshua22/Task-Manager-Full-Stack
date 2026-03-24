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

    @Scheduled(cron = "0 50 19 * * *", zone = "America/Argentina/Buenos_Aires")
    public void sendMorningReminders() {
        Long userId = 1L;
        String testToken = "cdWXa7guY3wrHiOm9JljSy:APA91bEH6exOg1zwqXN-2Phr28nLG5eA1mRGNjP-vKJLO6jFp5oCHEswVisW_tZpLLu8EGqFyXiIFnQZtyhuFLdiUGoQ5M1r99ieRFCiEdsqn-lW4D5e5T4";

        System.out.println("--- DISPARANDO PRUEBA MANUAL A LAS 19:50 ---");
        fcmService.sendPushNotification(testToken, "🚀 Prueba de Sistema", "Si ves esto, el puente Firebase-Mac funciona!");
    }
}