package com.cova.taskmanager.repository;

import com.cova.taskmanager.entity.Task;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user);

    List<Task> findByUserAndStatus(User user, TaskStatus status);

    Optional<Task> findByIdAndUser(Long id, User user);
}