package com.kesherManager.kesherManager.service;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TransportService {
    // Basic CRUD operations
    List<Transport> getAllTransports();

    Optional<Transport> getTransportById(Long id);

    Transport saveTransport(Transport transport);

    void deleteTransport(Long id);

    // Custom operations
    List<Transport> getTransportsBySourceBox(Box sourceBox);

    List<Transport> getTransportsByDestinationBox(Box destinationBox);

    List<Transport> getTransportsByStatus(Transport.TransportStatus status);

    List<Transport> getTransportsByScheduledDateBetween(Date startDate, Date endDate);

    List<Transport> getTransportsByDestinationType(Transport.DestinationType destinationType);

    List<Transport> getTransportsByCreatedBy(String createdBy);

    List<Transport> getTodayTransports(Transport.TransportStatus status);

    // Update transport status
    Transport updateStatus(Long transportId, Transport.TransportStatus newStatus);

    // Complete a transport
    Transport completeTransport(Long transportId, Date completionDate);
}