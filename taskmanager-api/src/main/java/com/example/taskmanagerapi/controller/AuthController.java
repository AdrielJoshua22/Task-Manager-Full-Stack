package com.example.taskmanagerapi.controller;

import com.example.taskmanagerapi.domain.User;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("username", user.getUsername());
                    response.put("mensaje", "Login exitoso");
                    return ResponseEntity.ok(response);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }
        userRepository.save(newUser);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }
}