package com.kesherManager.kesherManager.service.impl;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Task;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.repository.TaskRepository;
import com.kesherManager.kesherManager.service.TaskService;
import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import org.joda.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.Dates;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Task saveTask(Task task) {
        // Update timestamps before saving
        if (task.getId() == null) {
            task.setCreatedAt(Dates.nowUTC());
        }
        task.setUpdatedAt(Dates.nowUTC());

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> getTasksByPriority(Task.TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }

    @Override
    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBeforeAndStatusNot(Dates.nowUTC(), Task.TaskStatus.COMPLETED);
    }

    @Override
    public List<Task> getTasksByRelatedBox(Box box) {
        return taskRepository.findByRelatedBox(box);
    }

    @Override
    public List<Task> getTasksByRelatedTransport(Transport transport) {
        return taskRepository.findByRelatedTransport(transport);
    }

    @Override
    public List<Task> getTasksByAssignedTo(String assignedTo) {
        return taskRepository.findByAssignedTo(assignedTo);
    }

    @Override
    public List<Task> getTasksByType(Task.TaskType taskType) {
        return taskRepository.findByTaskType(taskType);
    }

    @Override
    public List<Task> getTasksByDueDateBetween(Date startDate, Date endDate) {
        return taskRepository.findByDueDateBetween(startDate, endDate);
    }

    // Helper method to handle Joda LocalDate
    public List<Task> getTasksByDueDateBetween(LocalDate startLocalDate, LocalDate endLocalDate) {
        Date startDate = Dates.atUtc(startLocalDate);

        // Set end date to end of the day
        LocalDateTime endOfDayTime = endLocalDate.toLocalDateTime(new LocalTime(23, 59, 59, 999));
        Date endDate = Dates.atUtc(endOfDayTime);

        return taskRepository.findByDueDateBetween(startDate, endDate);
    }

    @Override
    public Task updateStatus(Long taskId, Task.TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

        task.setStatus(newStatus);
        task.setUpdatedAt(Dates.nowUTC());

        return taskRepository.save(task);
    }

    @Override
    public Task assignTask(Long taskId, String assignedTo) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

        task.setAssignedTo(assignedTo);
        task.setUpdatedAt(Dates.nowUTC());

        return taskRepository.save(task);
    }

    // Helper method to create a task with a local date
    public Task createTask(Task.TaskType taskType, String description, LocalDate dueLocalDate, Task.TaskPriority priority) {
        Task task = new Task();
        task.setTaskType(taskType);
        task.setDescription(description);
        task.setDueDate(Dates.atUtc(dueLocalDate));
        task.setPriority(priority);
        task.setStatus(Task.TaskStatus.PENDING);
        task.setCreatedAt(Dates.nowUTC());
        task.setUpdatedAt(Dates.nowUTC());

        return taskRepository.save(task);
    }

    // Helper method to get tasks due today
    public List<Task> getTasksDueToday() {
        LocalDate today = LocalDate.now();

        // Start of today
        Date startOfDay = Dates.atUtc(today);

        // End of today
        LocalDateTime endOfDayTime = today.toLocalDateTime(new LocalTime(23, 59, 59, 999));
        Date endOfDay = Dates.atUtc(endOfDayTime);

        return taskRepository.findByDueDateBetween(startOfDay, endOfDay);
    }

    @Override
    public List<Task> getTasksByDonationGroup(String donationGroup) {
        return taskRepository.findByRelatedBox_DonationGroup(donationGroup);
    }

    @Override
    public List<Task> getTasksByAssociationManager(String associationManager) {
        return taskRepository.findByRelatedBox_AssociationManager(associationManager);
    }

    @Override
    public List<Task> getTasksByCategory(String category) {
        return taskRepository.findByTaskCategory(category);
    }
}
