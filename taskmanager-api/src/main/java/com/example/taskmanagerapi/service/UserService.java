package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.domain.User;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String rawPassword) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Error: El nombre de usuario ya está en uso.");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(rawPassword);

        return userRepository.save(newUser);
    }
    public User loginUser(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!user.getPassword().equals(rawPassword)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return user;
    }
}