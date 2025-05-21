package com.kesherManager.kesherManager.service;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;

import java.util.List;
import java.util.Optional;

public interface BoxService {
    // Basic CRUD operations
    List<Box> getAllBoxes();

    Optional<Box> getBoxById(Long id);

    Box saveBox(Box box);

    void deleteBox(Long id);

    // Custom operations
    List<Box> getBoxesByStatus(Box.BoxStatus status);

    List<Box> searchBoxesByLocationName(String locationName);

    List<Box> searchBoxesByAddress(String address);

    // Update box status
    Box updateStatus(Long boxId, Box.BoxStatus newStatus);

    // Get transports related to a box
    List<Transport> getOutgoingTransports(Long boxId);

    List<Transport> getIncomingTransports(Long boxId);

    List<Box> searchBoxesByResponsiblePerson(String responsiblePerson);
    List<Box> searchBoxesByAssociationManager(String associationManager);
    List<Box> getBoxesByDonationGroup(String donationGroup);
    Box updateBoxDetails(Long boxId, Box boxDetails);

}
