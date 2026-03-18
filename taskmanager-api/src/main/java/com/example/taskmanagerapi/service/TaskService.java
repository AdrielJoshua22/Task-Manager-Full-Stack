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

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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
        User user = fetchUser(username);
        task.setUser(user);
        if (task.getFrecuencia() == null || task.getFrecuencia().isBlank()) {
            task.setFrecuencia("NUNCA");
        }
        return taskRepository.save(task);
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
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}