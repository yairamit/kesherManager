package com.kesherManager.kesherManager.model;

import util.Dates;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "boxes")
public class Box {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location name cannot be empty")
    private String locationName;

    private String address;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    private BoxStatus status;

    private String notes;

    // List of outgoing transports from this box
    @OneToMany(mappedBy = "sourceBox", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transport> outgoingTransports = new ArrayList<>();

    // List of incoming transports to this box
    @OneToMany(mappedBy = "destinationBox", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transport> incomingTransports = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Enum for box status
    public enum BoxStatus {
        ACTIVE, MAINTENANCE, INACTIVE
    }

    // Constructors

    public Box() {
    }

    public Box(String locationName, String address) {
        this.locationName = locationName;
        this.address = address;
        this.status = BoxStatus.ACTIVE;
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

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public BoxStatus getStatus() {
        return status;
    }

    public void setStatus(BoxStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<Transport> getOutgoingTransports() {
        return outgoingTransports;
    }

    public void setOutgoingTransports(List<Transport> outgoingTransports) {
        this.outgoingTransports = outgoingTransports;
    }

    public List<Transport> getIncomingTransports() {
        return incomingTransports;
    }

    public void setIncomingTransports(List<Transport> incomingTransports) {
        this.incomingTransports = incomingTransports;
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

}