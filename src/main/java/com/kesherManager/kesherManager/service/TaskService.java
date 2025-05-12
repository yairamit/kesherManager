package com.kesherManager.kesherManager.service;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Task;
import com.kesherManager.kesherManager.model.Transport;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    // Basic CRUD operations
    List<Task> getAllTasks();

    Optional<Task> getTaskById(Long id);

    Task saveTask(Task task);

    void deleteTask(Long id);

    // Custom operations
    List<Task> getTasksByStatus(Task.TaskStatus status);

    List<Task> getTasksByPriority(Task.TaskPriority priority);

    List<Task> getOverdueTasks();

    List<Task> getTasksByRelatedBox(Box box);

    List<Task> getTasksByRelatedTransport(Transport transport);

    List<Task> getTasksByAssignedTo(String assignedTo);

    List<Task> getTasksByType(Task.TaskType taskType);

    List<Task> getTasksByDueDateBetween(Date startDate, Date endDate);

    // Update task status
    Task updateStatus(Long taskId, Task.TaskStatus newStatus);

    // Assign task to a person
    Task assignTask(Long taskId, String assignedTo);
}