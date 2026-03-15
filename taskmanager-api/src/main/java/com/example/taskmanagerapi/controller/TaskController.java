package com.example.taskmanagerapi.controller;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.repository.TaskRepository;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> ResponseEntity.ok(taskRepository.findByUserId(user.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/date/{date}")
    public ResponseEntity<List<Task>> getTasksByUserAndDate(
            @PathVariable String username,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return userRepository.findByUsername(username)
                .map(user -> ResponseEntity.ok(taskRepository.findTasksByDateAndFrequency(user.getId(), date)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{username}")
    public ResponseEntity<Task> createTask(@PathVariable String username, @RequestBody Task task) {
        return userRepository.findByUsername(username).map(user -> {
            task.setUser(user);
            if (task.getFrecuencia() == null || task.getFrecuencia().isEmpty()) {
                task.setFrecuencia("NUNCA");
            }
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task details) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(details.getTitle());
            task.setDescription(details.getDescription());
            task.setCompleted(details.isCompleted());
            task.setStartDate(details.getStartDate());
            task.setEndDate(details.getEndDate());
            task.setFrecuencia(details.getFrecuencia()); // Actualizamos la frecuencia también

            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}