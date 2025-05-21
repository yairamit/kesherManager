package com.kesherManager.kesherManager.controller;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Task;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.service.BoxService;
import com.kesherManager.kesherManager.service.TaskService;
import com.kesherManager.kesherManager.service.TransportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Controller", description = "API for managing tasks related to food boxes")
public class TaskController {

    private final TaskService taskService;
    private final BoxService boxService;
    private final TransportService transportService;

    @Autowired
    public TaskController(TaskService taskService, BoxService boxService, TransportService transportService) {
        this.taskService = taskService;
        this.boxService = boxService;
        this.transportService = transportService;
    }

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieve a list of all tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieve a specific task by its ID")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @Operation(summary = "Create a new task", description = "Add a new task to the system")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        // Validate related box if provided
        if (task.getRelatedBox() != null && task.getRelatedBox().getId() != null) {
            Optional<Box> box = boxService.getBoxById(task.getRelatedBox().getId());
            if (box.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

        // Validate related transport if provided
        if (task.getRelatedTransport() != null && task.getRelatedTransport().getId() != null) {
            Optional<Transport> transport = transportService.getTransportById(task.getRelatedTransport().getId());
            if (transport.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

        Task savedTask = taskService.saveTask(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task", description = "Update an existing task details")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        Optional<Task> existingTask = taskService.getTaskById(id);

        if (existingTask.isPresent()) {
            Task task = existingTask.get();

            // Validate related box if provided
            if (taskDetails.getRelatedBox() != null && taskDetails.getRelatedBox().getId() != null) {
                Optional<Box> box = boxService.getBoxById(taskDetails.getRelatedBox().getId());
                if (box.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                task.setRelatedBox(box.get());
            } else {
                task.setRelatedBox(null);
            }

            // Validate related transport if provided
            if (taskDetails.getRelatedTransport() != null && taskDetails.getRelatedTransport().getId() != null) {
                Optional<Transport> transport = transportService.getTransportById(taskDetails.getRelatedTransport().getId());
                if (transport.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                task.setRelatedTransport(transport.get());
            } else {
                task.setRelatedTransport(null);
            }

            task.setTaskType(taskDetails.getTaskType());
            task.setDescription(taskDetails.getDescription());
            task.setDueDate(taskDetails.getDueDate());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setNotes(taskDetails.getNotes());
            task.setAssignedTo(taskDetails.getAssignedTo());

            Task updatedTask = taskService.saveTask(task);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task", description = "Remove a task from the system")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status", description = "Change the status of a task")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam Task.TaskStatus status) {

        try {
            Task updatedTask = taskService.updateStatus(id, status);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign task", description = "Assign a task to a person")
    public ResponseEntity<Task> assignTask(
            @PathVariable Long id,
            @RequestParam String assignedTo) {

        try {
            Task assignedTask = taskService.assignTask(id, assignedTo);
            return new ResponseEntity<>(assignedTask, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get tasks by status", description = "Retrieve all tasks with a specific status")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable Task.TaskStatus status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/priority/{priority}")
    @Operation(summary = "Get tasks by priority", description = "Retrieve all tasks with a specific priority")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable Task.TaskPriority priority) {
        List<Task> tasks = taskService.getTasksByPriority(priority);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue tasks", description = "Retrieve all tasks that are overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        List<Task> tasks = taskService.getOverdueTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get tasks by date range", description = "Retrieve all tasks due within a date range")
    public ResponseEntity<List<Task>> getTasksByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        List<Task> tasks = taskService.getTasksByDueDateBetween(startDate, endDate);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/assigned/{assignee}")
    @Operation(summary = "Get tasks by assignee", description = "Retrieve all tasks assigned to a specific person")
    public ResponseEntity<List<Task>> getTasksByAssignee(@PathVariable String assignee) {
        List<Task> tasks = taskService.getTasksByAssignedTo(assignee);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/type/{taskType}")
    @Operation(summary = "Get tasks by type", description = "Retrieve all tasks of a specific type")
    public ResponseEntity<List<Task>> getTasksByType(@PathVariable Task.TaskType taskType) {
        List<Task> tasks = taskService.getTasksByType(taskType);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/donation-group/{group}")
    @Operation(summary = "Get tasks by donation group", description = "Find tasks for boxes in a specific donation group")
    public ResponseEntity<List<Task>> getTasksByDonationGroup(@PathVariable String group) {
        List<Task> tasks = taskService.getTasksByDonationGroup(group);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/association-manager/{manager}")
    @Operation(summary = "Get tasks by association manager", description = "Find tasks for boxes managed by a specific association manager")
    public ResponseEntity<List<Task>> getTasksByAssociationManager(@PathVariable String manager) {
        List<Task> tasks = taskService.getTasksByAssociationManager(manager);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get tasks by category", description = "Find tasks in a specific category")
    public ResponseEntity<List<Task>> getTasksByCategory(@PathVariable String category) {
        List<Task> tasks = taskService.getTasksByCategory(category);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }


}