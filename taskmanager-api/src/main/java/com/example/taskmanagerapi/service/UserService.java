package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.domain.User;
import com.example.taskmanagerapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User registerUser(String username, String rawPassword, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Error: El nombre de usuario ya está en uso.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(rawPassword);
        newUser.setEmail(email);

        return userRepository.save(newUser);
    }

    @Transactional
    public void updateFcmToken(String username, String token) {
        User user = findByUsername(username);
        user.setFcmToken(token);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User loginUser(String username, String rawPassword) {
        User user = findByUsername(username);
        if (!user.getPassword().equals(rawPassword)) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
    }
}