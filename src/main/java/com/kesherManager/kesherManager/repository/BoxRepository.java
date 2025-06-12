package com.kesherManager.kesherManager.repository;

import com.kesherManager.kesherManager.model.Box;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoxRepository extends JpaRepository<Box, Long> {
    // Find boxes by status


    List<Box> findByStatus(Box.BoxStatus status);

    // New methods for additional fields
    List<Box> findByResponsiblePersonContainingIgnoreCase(String responsiblePerson);
    List<Box> findByAssociationManagerContainingIgnoreCase(String associationManager);
    List<Box> findByDonationGroup(String donationGroup);

    // Find boxes by address (partial match, case insensitive)
    List<Box> findByAddressContainingIgnoreCase(String address);
}