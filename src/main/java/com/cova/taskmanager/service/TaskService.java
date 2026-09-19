package com.cova.taskmanager.service;

import com.cova.taskmanager.dto.CreateTaskRequest;
import com.cova.taskmanager.dto.TaskResponse;
import com.cova.taskmanager.dto.UpdateTaskRequest;
import com.cova.taskmanager.entity.Task;
import com.cova.taskmanager.entity.TaskStatus;
import com.cova.taskmanager.entity.User;
import com.cova.taskmanager.exception.TaskNotFoundException;
import com.cova.taskmanager.repository.TaskRepository;
import com.cova.taskmanager.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasks(TaskStatus status) {
        User user = SecurityUtils.getCurrentUser();
        List<Task> tasks = status == null
                ? taskRepository.findByUser(user)
                : taskRepository.findByUserAndStatus(user, status);
        return tasks.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        User user = SecurityUtils.getCurrentUser();

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setUser(user);

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        User user = SecurityUtils.getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(TaskNotFoundException::new);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        return toResponse(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        User user = SecurityUtils.getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(TaskNotFoundException::new);
        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt());
    }
}
