package com.kesherManager.kesherManager.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "boxes")
public class Box {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String responsiblePerson;

    private String responsiblePersonPhone;

    private String associationManager;

    private String donationGroup;

    private String familyName;
    private String city;
    private String address;

    private Double latitude;

    private Double longitude;



    @Enumerated(EnumType.STRING)
    private BoxStatus status;

    private String notes;

    private String DeliveryVolunteer;

    private String DeliveryVolunteerPhone;

    // List of outgoing transports from this box
   // @OneToMany(mappedBy = "sourceBox", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
   // private List<Transport> outgoingTransports = new ArrayList<>();

    // List of incoming transports to this box
   // @OneToMany(mappedBy = "destinationBox", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //private List<Transport> incomingTransports = new ArrayList<>();


    private Date createdAt;

    private Date updatedAt;

    public String getDeliveryVolunteerPhone() {
        return DeliveryVolunteerPhone;
    }

    public void setDeliveryVolunteerPhone(String deliveryVolunteerPhone) {
        DeliveryVolunteerPhone = deliveryVolunteerPhone;
    }

    public String getDeliveryVolunteer() {
        return DeliveryVolunteer;
    }

    public void setDeliveryVolunteer(String deliveryVolunteer) {
        DeliveryVolunteer = deliveryVolunteer;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    public String boxType;

    // Enum for box status
    public enum BoxStatus {
        ACTIVE, MAINTENANCE, INACTIVE
    }

    // Constructors



    public Box() {
        ;
    }

    public Box( String address, String responsiblePerson,
               String responsiblePersonPhone, String associationManager, String donationGroup, String familyName, Date updatedAt, String city, BoxStatus status, String boxType, String DeliveryVolunteer, String DeliveryVolunteerPhone) {
         this.responsiblePerson = responsiblePerson;
        this.responsiblePersonPhone = responsiblePersonPhone;
        this.associationManager = associationManager;
        this.donationGroup = donationGroup;
        this.familyName = familyName;
        this.boxType = boxType;
        this.status = BoxStatus.ACTIVE;
        this.updatedAt = updatedAt;
        this.address = address;
        this.city = city;
        this.DeliveryVolunteer = DeliveryVolunteer;
        this.DeliveryVolunteerPhone = DeliveryVolunteerPhone;
    }


    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getBoxType() {
        return boxType;
    }

    public void setBoxType(String boxType) {
        this.boxType = boxType;
    }

    /*public List<Transport> getOutgoingTransports() {
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
    }*/

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


   /* @JsonProperty("createdAt")
    public org.joda.time.LocalDateTime getCreatedAtLocal() {
        if (this.createdAt == null) {
            return null;
        }
        return Dates.atLocalTime(this.createdAt);
    }

    @JsonProperty("updatedAt")
    public org.joda.time.LocalDateTime getUpdatedAtLocal() {
        if (this.updatedAt == null) {
            return null;
        }
        return Dates.atLocalTime(this.updatedAt);
    }
*/

    public String getResponsiblePerson() {
        return responsiblePerson;
    }

    public void setResponsiblePerson(String responsiblePerson) {
        this.responsiblePerson = responsiblePerson;
    }

    public String getResponsiblePersonPhone() {
        return responsiblePersonPhone;
    }

    public void setResponsiblePersonPhone(String responsiblePersonPhone) {
        this.responsiblePersonPhone = responsiblePersonPhone;
    }

    public String getAssociationManager() {
        return associationManager;
    }

    public void setAssociationManager(String associationManager) {
        this.associationManager = associationManager;
    }

    public String getDonationGroup() {
        return donationGroup;
    }

    public void setDonationGroup(String donationGroup) {
        this.donationGroup = donationGroup;
    }
}


