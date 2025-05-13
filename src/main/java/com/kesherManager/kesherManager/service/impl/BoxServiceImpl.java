package com.kesherManager.kesherManager.service.impl;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.repository.BoxRepository;
import com.kesherManager.kesherManager.repository.TransportRepository;
import com.kesherManager.kesherManager.service.BoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.Dates;

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
    public List<Box> searchBoxesByLocationName(String locationName) {
        return boxRepository.findByLocationNameContainingIgnoreCase(locationName);
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
}