package com.example.taskmanagerapi.repository;

import com.example.taskmanagerapi.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    @Query(value = "SELECT * FROM tasks " +
            "WHERE user_id = :userId " +
            "AND DATE(start_date) <= :fecha " +
            "AND (" +
            "    (frecuencia = 'NUNCA' AND DATE(start_date) = :fecha) OR " +
            "    (frecuencia = 'DIARIA') OR " +
            "    (frecuencia = 'SEMANAL' AND DAYOFWEEK(start_date) = DAYOFWEEK(:fecha)) OR " +
            "    (frecuencia = 'MENSUAL' AND DAY(start_date) = DAY(:fecha)) " +
            ")", nativeQuery = true)
    List<Task> findTasksByDateAndFrequency(@Param("userId") Long userId, @Param("fecha") LocalDate fecha);
}