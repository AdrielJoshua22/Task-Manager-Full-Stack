package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.domain.User;
import com.example.taskmanagerapi.repository.TaskRepository;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final FcmService fcmService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, FcmService fcmService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.fcmService = fcmService;
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByUsername(String username) {
        User user = fetchUser(username);
        return taskRepository.findByUserId(user.getId());
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByDate(String username, LocalDate date) {
        User user = fetchUser(username);
        return taskRepository.findTasksByDateAndFrequency(user.getId(), date);
    }

    @Transactional
    public Task createTask(String username, Task task) {
        System.out.println("🚀 [DEBUG] Iniciando createTask para: " + username);

        User user = fetchUser(username);
        System.out.println("✅ [DEBUG] Usuario verificado: ID " + user.getId() + " | Token: " + (user.getFcmToken() != null ? "PRESENTE" : "NULO"));

        task.setUser(user);
        if (task.getFrecuencia() == null || task.getFrecuencia().isBlank()) {
            task.setFrecuencia("NUNCA");
        }

        Task savedTask = taskRepository.save(task);
        System.out.println("💾 [DEBUG] Tarea persistida en MySQL con ID: " + savedTask.getId());

        if (user.getFcmToken() != null && !user.getFcmToken().isBlank()) {
            System.out.println("🔔 [DEBUG] Disparando notificación FCM al token...");
            fcmService.sendPushNotification(
                    user.getFcmToken(),
                    "Nueva Tarea Creada",
                    "Se agregó: " + savedTask.getTitle()
            );
        } else {
            System.out.println("⚠️ [DEBUG] Salteando notificación: El usuario no tiene token FCM.");
        }

        return savedTask;
    }

    @Transactional
    public Task updateTask(Long id, Task details) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(details.getTitle());
                    task.setDescription(details.getDescription());
                    task.setCompleted(details.isCompleted());
                    task.setStartDate(details.getStartDate());
                    task.setEndDate(details.getEndDate());
                    task.setFrecuencia(details.getFrecuencia());
                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("La tarea no existe");
        }
        taskRepository.deleteDirectById(id);
    }

    private User fetchUser(String username) {
        // 1. Verificamos exactamente qué string está llegando del Frontend
        System.out.println("🔍 [DEBUG] Buscando a: '" + username + "' (Largo: " + (username != null ? username.length() : 0) + ")");

        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    // 2. Diagnóstico: Listamos qué usuarios SÍ existen en esta DB
                    List<User> reales = userRepository.findAll();
                    System.err.println("❌ [ERROR] El usuario '" + username + "' NO existe en esta DB.");
                    System.err.println("📋 [INFO] Usuarios encontrados en la tabla 'users': " +
                            reales.stream().map(User::getUsername).toList());

                    return new RuntimeException("Usuario no encontrado: " + username);
                });
    }
}