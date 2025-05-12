package com.kesherManager.kesherManager.repository;

import com.kesherManager.kesherManager.model.Box;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoxRepository extends JpaRepository<Box, Long> {
    // Find boxes by status
    List<Box> findByStatus(Box.BoxStatus status);

    // Find boxes by location name (partial match, case insensitive)
    List<Box> findByLocationNameContainingIgnoreCase(String locationName);

    // Find boxes by address (partial match, case insensitive)
    List<Box> findByAddressContainingIgnoreCase(String address);
}