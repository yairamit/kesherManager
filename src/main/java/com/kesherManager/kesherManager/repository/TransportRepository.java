package com.kesherManager.kesherManager.repository;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransportRepository extends JpaRepository<Transport, Long> {
    // Find transports by source box
    List<Transport> findBySourceBox(Box sourceBox);

    // Find transports by destination box (if destination type is BOX)
    List<Transport> findByDestinationBox(Box destinationBox);

    // Find transports by status
    List<Transport> findByStatus(Transport.TransportStatus status);

    // Find transports scheduled between two dates
    List<Transport> findByScheduledDateBetween(Date startDate, Date endDate);

    // Find transports by destination type
    List<Transport> findByDestinationType(Transport.DestinationType destinationType);

    // Find transports created by a specific user
    List<Transport> findByCreatedBy(String createdBy);

    // Find completed transports
    List<Transport> findByCompletionDateIsNotNull();

    // Find transports for today (requires custom implementation or using between)
    List<Transport> findByScheduledDateBetweenAndStatus(Date startOfDay, Date endOfDay, Transport.TransportStatus status);

    List<Transport> findBySourceBox_DonationGroup(String donationGroup);
    List<Transport> findByDestinationBox_DonationGroup(String donationGroup);
    List<Transport> findByDriverNameContainingIgnoreCase(String driverName);
}
