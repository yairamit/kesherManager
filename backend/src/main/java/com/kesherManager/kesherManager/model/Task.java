package com.kesherManager.kesherManager.model;

import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import com.kesherManager.kesherManager.util.Dates ;

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


    private Date dueDate;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private String notes;


    private Date createdAt;


    private Date updatedAt;

    private String taskCategory;

    // Add new getters and setters
    public String getTaskCategory() {
        return taskCategory;
    }

    public void setTaskCategory(String taskCategory) {
        this.taskCategory = taskCategory;
    }

    // Add convenience method to get box's donation group when a task is related to a box
    @Transient // Not stored in DB, calculated on demand
    public String getRelatedDonationGroup() {
        if (relatedBox != null) {
            return relatedBox.getDonationGroup();
        }
        return null;
    }

    // Add convenience method to get box's responsible person when a task is related to a box
    @Transient
    public String getRelatedResponsiblePerson() {
        if (relatedBox != null) {
            return relatedBox.getResponsiblePerson();
        }
        return null;
    }

    // Add convenience method to get box's association manager when a task is related to a box
    @Transient
    public String getRelatedAssociationManager() {
        if (relatedBox != null) {
            return relatedBox.getAssociationManager();
        }
        return null;
    }

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
        this.createdAt = Dates.nowUTC();
        this.updatedAt = Dates.nowUTC();
    }

    // Add constructor that accepts Joda LocalDate

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






    // Update helper methods
    public boolean isOverdue() {
        return dueDate != null && dueDate.before(Dates.nowUTC()) && status != TaskStatus.COMPLETED;
    }

    public boolean isCompleted() {
        return status == TaskStatus.COMPLETED;
    }

    // Add helper for date check
    public boolean isDueToday() {
        if (dueDate == null) return false;

        LocalDate today = LocalDate.now();
        LocalDateTime dueLocalDateTime = Dates.atLocalTime(dueDate);

        return dueLocalDateTime != null &&
                dueLocalDateTime.toLocalDate().equals(today);
    }

}