package com.kesherManager.kesherManager.service.impl;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.repository.TransportRepository;
import com.kesherManager.kesherManager.service.TransportService;
import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import org.joda.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kesherManager.kesherManager.util.Dates ;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TransportServiceImpl implements TransportService {

    private final TransportRepository transportRepository;

    @Autowired
    public TransportServiceImpl(TransportRepository transportRepository) {
        this.transportRepository = transportRepository;
    }

    @Override
    public List<Transport> getAllTransports() {
        return transportRepository.findAll();
    }

    @Override
    public Optional<Transport> getTransportById(Long id) {
        return transportRepository.findById(id);
    }

    @Override
    public Transport saveTransport(Transport transport) {
        // Update timestamps before saving
        if (transport.getId() == null) {
            transport.setCreatedAt(Dates.nowUTC());
        }
        transport.setUpdatedAt(Dates.nowUTC());

        return transportRepository.save(transport);
    }

    @Override
    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }

    @Override
    public List<Transport> getTransportsBySourceBox(Box sourceBox) {
        return transportRepository.findBySourceBox(sourceBox);
    }

    @Override
    public List<Transport> getTransportsByDestinationBox(Box destinationBox) {
        return transportRepository.findByDestinationBox(destinationBox);
    }

    @Override
    public List<Transport> getTransportsByStatus(Transport.TransportStatus status) {
        return transportRepository.findByStatus(status);
    }

    @Override
    public List<Transport> getTransportsByScheduledDateBetween(Date startDate, Date endDate) {
        return transportRepository.findByScheduledDateBetween(startDate, endDate);
    }

    // Helper method to handle Joda LocalDate
    public List<Transport> getTransportsByScheduledDateBetween(LocalDate startLocalDate, LocalDate endLocalDate) {
        Date startDate = Dates.atUtc(startLocalDate);

        // Set end date to end of the day
        LocalDateTime endOfDayTime = endLocalDate.toLocalDateTime(new LocalTime(23, 59, 59, 999));
        Date endDate = Dates.atUtc(endOfDayTime);

        return transportRepository.findByScheduledDateBetween(startDate, endDate);
    }

    @Override
    public List<Transport> getTransportsByDestinationType(Transport.DestinationType destinationType) {
        return transportRepository.findByDestinationType(destinationType);
    }

    @Override
    public List<Transport> getTransportsByCreatedBy(String createdBy) {
        return transportRepository.findByCreatedBy(createdBy);
    }

    @Override
    public List<Transport> getTodayTransports(Transport.TransportStatus status) {
        // Get today's date
        LocalDate today = LocalDate.now();

        // Start of day - midnight
        Date startOfDay = Dates.atUtc(today);

        // End of day - 23:59:59.999
        LocalDateTime endOfDayTime = today.toLocalDateTime(new LocalTime(23, 59, 59, 999));
        Date endOfDay = Dates.atUtc(endOfDayTime);

        return transportRepository.findByScheduledDateBetweenAndStatus(startOfDay, endOfDay, status);
    }

    @Override
    public Transport updateStatus(Long transportId, Transport.TransportStatus newStatus) {
        Transport transport = transportRepository.findById(transportId)
                .orElseThrow(() -> new EntityNotFoundException("Transport not found with ID: " + transportId));

        transport.setStatus(newStatus);
        transport.setUpdatedAt(Dates.nowUTC());

        // If the transport is being completed, set the completion date
        if (newStatus == Transport.TransportStatus.COMPLETED && transport.getCompletionDate() == null) {
            transport.setCompletionDate(Dates.nowUTC());
        }

        return transportRepository.save(transport);
    }

    @Override
    public List<Transport> getTransportsBySourceDonationGroup(String donationGroup) {
        return transportRepository.findBySourceBox_DonationGroup(donationGroup);
    }

    @Override
    public List<Transport> getTransportsByDestinationDonationGroup(String donationGroup) {
        return transportRepository.findByDestinationBox_DonationGroup(donationGroup);
    }

    @Override
    public List<Transport> searchTransportsByDriverName(String driverName) {
        return transportRepository.findByDriverNameContainingIgnoreCase(driverName);
    }

    @Override
    public Transport completeTransport(Long transportId, Date completionDate) {
        Transport transport = transportRepository.findById(transportId)
                .orElseThrow(() -> new EntityNotFoundException("Transport not found with ID: " + transportId));

        transport.setStatus(Transport.TransportStatus.COMPLETED);
        transport.setCompletionDate(completionDate != null ? completionDate : Dates.nowUTC());
        transport.setUpdatedAt(Dates.nowUTC());

        return transportRepository.save(transport);
    }

    // Helper method to handle Joda LocalDate
    public Transport completeTransport(Long transportId, LocalDate completionLocalDate) {
        Date completionDate = completionLocalDate != null ? Dates.atUtc(completionLocalDate) : Dates.nowUTC();
        return completeTransport(transportId, completionDate);
    }
}