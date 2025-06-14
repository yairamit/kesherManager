package com.kesherManager.kesherManager.service.impl;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.repository.BoxRepository;
import com.kesherManager.kesherManager.repository.TransportRepository;
import com.kesherManager.kesherManager.service.BoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kesherManager.kesherManager.util.Dates;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class BoxServiceImpl implements BoxService {

    private final BoxRepository boxRepository;
    private final TransportRepository transportRepository;

    @Autowired
    public BoxServiceImpl(BoxRepository boxRepository, TransportRepository transportRepository) {
        this.boxRepository = boxRepository;
        this.transportRepository = transportRepository;
    }

    @Override
    public List<Box> getAllBoxes() {
        return boxRepository.findAll();
    }

    @Override
    public Optional<Box> getBoxById(Long id) {
        return boxRepository.findById(id);
    }

    @Override
    public Box saveBox(Box box) {
        // Update timestamps before saving
        if (box.getId() == null) {
            box.setCreatedAt(Dates.nowUTC());
        }
        box.setUpdatedAt(Dates.nowUTC());

        return boxRepository.save(box);
    }

    @Override
    public void deleteBox(Long id) {
        boxRepository.deleteById(id);
    }

    @Override
    public List<Box> getBoxesByStatus(Box.BoxStatus status) {
        return boxRepository.findByStatus(status);
    }



    @Override
    public List<Box> searchBoxesByAddress(String address) {
        return boxRepository.findByAddressContainingIgnoreCase(address);
    }

    @Override
    public Box updateStatus(Long boxId, Box.BoxStatus newStatus) {
        Box box = boxRepository.findById(boxId)
                .orElseThrow(() -> new EntityNotFoundException("Box not found with ID: " + boxId));

        box.setStatus(newStatus);
        box.setUpdatedAt(Dates.nowUTC());

        return boxRepository.save(box);
    }

    @Override
    public List<Transport> getOutgoingTransports(Long boxId) {
        Box box = boxRepository.findById(boxId)
                .orElseThrow(() -> new EntityNotFoundException("Box not found with ID: " + boxId));

        return transportRepository.findBySourceBox(box);
    }

    @Override
    public List<Transport> getIncomingTransports(Long boxId) {
        Box box = boxRepository.findById(boxId)
                .orElseThrow(() -> new EntityNotFoundException("Box not found with ID: " + boxId));

        return transportRepository.findByDestinationBox(box);
    }

    @Override
    public List<Box> searchBoxesByResponsiblePerson(String responsiblePerson) {
        return boxRepository.findByResponsiblePersonContainingIgnoreCase(responsiblePerson);
    }

    @Override
    public List<Box> searchBoxesByAssociationManager(String associationManager) {
        return boxRepository.findByAssociationManagerContainingIgnoreCase(associationManager);
    }

    @Override
    public List<Box> getBoxesByDonationGroup(String donationGroup) {
        return boxRepository.findByDonationGroup(donationGroup);
    }

    @Override
    public Box updateBoxDetails(Long boxId, Box boxDetails) {
        Box box = boxRepository.findById(boxId)
                .orElseThrow(() -> new EntityNotFoundException("Box not found with ID: " + boxId));

        // Update all box fields from the details object
        box.setDonationGroup(boxDetails.getDonationGroup());
        box.setAddress(boxDetails.getAddress());
        box.setLatitude(boxDetails.getLatitude());
        box.setLongitude(boxDetails.getLongitude());
        box.setStatus(boxDetails.getStatus());
        box.setNotes(boxDetails.getNotes());

        // Update new fields
        box.setResponsiblePerson(boxDetails.getResponsiblePerson());
        box.setResponsiblePersonPhone(boxDetails.getResponsiblePersonPhone());
        box.setAssociationManager(boxDetails.getAssociationManager());
        box.setDonationGroup(boxDetails.getDonationGroup());

        // Update the timestamp
        box.setUpdatedAt(Dates.nowUTC());

        return boxRepository.save(box);
    }
}