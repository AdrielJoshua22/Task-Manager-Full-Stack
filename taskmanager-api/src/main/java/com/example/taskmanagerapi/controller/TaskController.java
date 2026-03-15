package com.example.taskmanagerapi.controller;

import com.example.taskmanagerapi.domain.Task;
import com.example.taskmanagerapi.repository.TaskRepository;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
// Cambiamos el origin específico por "*" para que Vercel pueda entrar sin problemas
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE
})
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // Refactor: Inyección por constructor (más seguro y fácil de testear)
    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{username}")
    public List<Task> getTasksByUser(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> taskRepository.findByUserId(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @GetMapping("/user/{username}/date/{date}")
    public List<Task> getTasksByUserAndDate(
            @PathVariable String username,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return userRepository.findByUsername(username)
                .map(user -> taskRepository.findTasksByDateAndFrequency(user.getId(), date))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @PostMapping("/{username}")
    public ResponseEntity<Task> createTask(@PathVariable String username, @RequestBody Task task) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    task.setUser(user);
                    // Lógica de frecuencia por defecto optimizada
                    if (task.getFrecuencia() == null || task.getFrecuencia().isBlank()) {
                        task.setFrecuencia("NUNCA");
                    }
                    return ResponseEntity.status(HttpStatus.CREATED).body(taskRepository.save(task));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear tarea: usuario inexistente"));
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task details) {
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarea no encontrada"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se puede eliminar: tarea no existe");
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}