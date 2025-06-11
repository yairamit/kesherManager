package com.kesherManager.kesherManager.model;

import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import com.kesherManager.kesherManager.util.Dates ;

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


    private Date scheduledDate;


    private Date completionDate;

    @Enumerated(EnumType.STRING)
    private TransportStatus status;

    private String notes;

    private String createdBy;


    private Date createdAt;


    private Date updatedAt;

    // Enums
    public enum DestinationType {
        BOX, STORE, FAMILY
    }

    public enum TransportStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }


    private String driverName;
    private String driverPhone;






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

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverPhone() {
        return driverPhone;
    }

    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
    }

    // Add convenience methods to access box-related information
    @Transient
    public String getSourceDonationGroup() {
        if (sourceBox != null) {
            return sourceBox.getDonationGroup();
        }
        return null;
    }

    @Transient
    public String getDestinationDonationGroup() {
        if (destinationBox != null && destinationType == DestinationType.BOX) {
            return destinationBox.getDonationGroup();
        }
        return null;
    }






}