package com.kesherManager.kesherManager.model;

import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import util.Dates;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "transports")
public class Transport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_box_id", nullable = false)
    private Box sourceBox;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Destination type must be defined")
    private DestinationType destinationType;

    // If the destination is another box
    @ManyToOne
    @JoinColumn(name = "destination_box_id")
    private Box destinationBox;

    // If the destination is a family or store, we store their ID
    private Long destinationId;

    // Destination name (family name or store name) - only if destination is not a box
    private String destinationName;

    // Description of the quantity of food transported
    private String quantity;

    @Temporal(TemporalType.TIMESTAMP)
    private Date scheduledDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date completionDate;

    @Enumerated(EnumType.STRING)
    private TransportStatus status;

    private String notes;

    private String createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Enums
    public enum DestinationType {
        BOX, STORE, FAMILY
    }

    public enum TransportStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    // Constructors

    public Transport() {
    }

    public Transport(Box sourceBox, DestinationType destinationType, Date scheduledDate) {
        this.sourceBox = sourceBox;
        this.destinationType = destinationType;
        this.scheduledDate = scheduledDate;
        this.status = TransportStatus.PLANNED;
        this.createdAt = Dates.nowUTC();
        this.updatedAt = Dates.nowUTC();
    }

    // Add constructor that accepts Joda LocalDate
    public Transport(Box sourceBox, DestinationType destinationType, LocalDate scheduledLocalDate) {
        this.sourceBox = sourceBox;
        this.destinationType = destinationType;
        this.scheduledDate = Dates.atUtc(scheduledLocalDate);
        this.status = TransportStatus.PLANNED;
        this.createdAt = Dates.nowUTC();
        this.updatedAt = Dates.nowUTC();
    }



    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Box getSourceBox() {
        return sourceBox;
    }

    public void setSourceBox(Box sourceBox) {
        this.sourceBox = sourceBox;
    }

    public DestinationType getDestinationType() {
        return destinationType;
    }

    public void setDestinationType(DestinationType destinationType) {
        this.destinationType = destinationType;
    }

    public Box getDestinationBox() {
        return destinationBox;
    }

    public void setDestinationBox(Box destinationBox) {
        this.destinationBox = destinationBox;
    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public Date getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(Date scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }

    public TransportStatus getStatus() {
        return status;
    }

    public void setStatus(TransportStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public void setScheduledDate(LocalDate scheduledLocalDate) {
        this.scheduledDate = Dates.atUtc(scheduledLocalDate);
    }

    public void setScheduledDate(LocalDateTime scheduledLocalDateTime) {
        this.scheduledDate = Dates.atUtc(scheduledLocalDateTime);
    }

    public void setCompletionDate(LocalDate completionLocalDate) {
        this.completionDate = Dates.atUtc(completionLocalDate);
    }

    public void setCompletionDate(LocalDateTime completionLocalDateTime) {
        this.completionDate = Dates.atUtc(completionLocalDateTime);
    }

    // Update lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = Dates.nowUTC();
        updatedAt = Dates.nowUTC();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Dates.nowUTC();
    }

    // Update helper methods
    public boolean isCompleted() {
        return status == TransportStatus.COMPLETED;
    }

    // Add extra helper for date check
    public boolean isScheduledForToday() {
        if (scheduledDate == null) return false;

        LocalDate today = LocalDate.now();
        LocalDateTime scheduledLocalDateTime = Dates.atLocalTime(scheduledDate);

        return scheduledLocalDateTime != null &&
                scheduledLocalDateTime.toLocalDate().equals(today);
    }
}