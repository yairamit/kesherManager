package com.kesherManager.kesherManager.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TaskType taskType;

    @ManyToOne
    @JoinColumn(name = "related_box_id")
    private Box relatedBox;

    @ManyToOne
    @JoinColumn(name = "related_transport_id")
    private Transport relatedTransport;

    @NotBlank(message = "Task description cannot be empty")
    private String description;

    private String assignedTo;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dueDate;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private String notes;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Enums
    public enum TaskType {
        COLLECTION, TRANSPORT, MAINTENANCE, OTHER
    }

    public enum TaskPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    // Constructors

    public Task() {
    }

    public Task(TaskType taskType, String description, Date dueDate, TaskPriority priority) {
        this.taskType = taskType;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = TaskStatus.PENDING;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public Box getRelatedBox() {
        return relatedBox;
    }

    public void setRelatedBox(Box relatedBox) {
        this.relatedBox = relatedBox;
    }

    public Transport getRelatedTransport() {
        return relatedTransport;
    }

    public void setRelatedTransport(Transport relatedTransport) {
        this.relatedTransport = relatedTransport;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Lifecycle methods

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    // Helper methods

    public boolean isOverdue() {
        return dueDate != null && dueDate.before(new Date()) && status != TaskStatus.COMPLETED;
    }

    public boolean isCompleted() {
        return status == TaskStatus.COMPLETED;
    }
}