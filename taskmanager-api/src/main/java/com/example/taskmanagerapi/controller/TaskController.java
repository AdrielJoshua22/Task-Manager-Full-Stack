package com.example.taskmanagerapi.controller;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.service.TaskService;
import com.example.taskmanagerapi.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }


    @GetMapping("/user/{username}")
    public List<Task> getTasksByUser(@PathVariable String username) {
        return taskService.getTasksByUsername(username);
    }

    @GetMapping("/user/{username}/date/{date}")
    public List<Task> getTasksByUserAndDate(
            @PathVariable String username,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return taskService.getTasksByDate(username, date);
    }

    @PostMapping("/{username}")
    public ResponseEntity<Task> createTask(@PathVariable String username, @RequestBody Task task) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(username, task));
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task details) {
        return taskService.updateTask(id, details);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/user/{username}/fcm-token")
    public ResponseEntity<Void> updateFcmToken(@PathVariable String username, @RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        userService.updateFcmToken(username, token);
        return ResponseEntity.ok().build();
    }
}