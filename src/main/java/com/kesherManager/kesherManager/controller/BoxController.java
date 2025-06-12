package com.kesherManager.kesherManager.controller;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.service.BoxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/boxes")
@Tag(name = "Box Controller", description = "API for managing food boxes")
public class BoxController {

    private final BoxService boxService;

    @Autowired
    public BoxController(BoxService boxService) {
        this.boxService = boxService;
    }

    @GetMapping
    @Operation(summary = "Get all boxes", description = "Retrieve a list of all food boxes")
    public ResponseEntity<List<Box>> getAllBoxes() {
        List<Box> boxes = boxService.getAllBoxes();
        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get box by ID", description = "Retrieve a specific box by its ID")
    public ResponseEntity<Box> getBoxById(@PathVariable Long id) {
        Optional<Box> box = boxService.getBoxById(id);
        return box.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @Operation(summary = "Create a new box", description = "Add a new food box to the system")
    public ResponseEntity<Box> createBox(@Valid @RequestBody Box box) {
        Box savedBox = boxService.saveBox(box);
        return new ResponseEntity<>(savedBox, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a box", description = "Update an existing food box details")
    public ResponseEntity<Box> updateBox(@PathVariable Long id, @Valid @RequestBody Box boxDetails) {
        Optional<Box> existingBox = boxService.getBoxById(id);

        if (existingBox.isPresent()) {
            Box box = existingBox.get();

            // Update the existing box with new details
            box.setDonationGroup(boxDetails.getDonationGroup());
            box.setAddress(boxDetails.getAddress());
            box.setLatitude(boxDetails.getLatitude());
            box.setLongitude(boxDetails.getLongitude());
            box.setStatus(boxDetails.getStatus());
            box.setNotes(boxDetails.getNotes());
            box.setResponsiblePerson(boxDetails.getResponsiblePerson());
            box.setResponsiblePersonPhone(boxDetails.getResponsiblePersonPhone());
            box.setAssociationManager(boxDetails.getAssociationManager());
            box.setDonationGroup(boxDetails.getDonationGroup());

            Box updatedBox = boxService.saveBox(box);
            return new ResponseEntity<>(updatedBox, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a box", description = "Remove a food box from the system")
    public ResponseEntity<HttpStatus> deleteBox(@PathVariable Long id) {
        try {
            boxService.deleteBox(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update box status", description = "Change the status of a food box")
    public ResponseEntity<Box> updateBoxStatus(
            @PathVariable Long id,
            @RequestParam Box.BoxStatus status) {

        try {
            Box updatedBox = boxService.updateStatus(id, status);
            return new ResponseEntity<>(updatedBox, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/outgoing-transports")
    @Operation(summary = "Get outgoing transports", description = "Retrieve all transports from this box to others")
    public ResponseEntity<List<Transport>> getOutgoingTransports(@PathVariable Long id) {
        try {
            List<Transport> transports = boxService.getOutgoingTransports(id);
            return new ResponseEntity<>(transports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/incoming-transports")
    @Operation(summary = "Get incoming transports", description = "Retrieve all transports to this box from others")
    public ResponseEntity<List<Transport>> getIncomingTransports(@PathVariable Long id) {
        try {
            List<Transport> transports = boxService.getIncomingTransports(id);
            return new ResponseEntity<>(transports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get boxes by status", description = "Retrieve all boxes with a specific status")
    public ResponseEntity<List<Box>> getBoxesByStatus(@PathVariable Box.BoxStatus status) {
        List<Box> boxes = boxService.getBoxesByStatus(status);
        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    @GetMapping("/search")
    @Operation(summary = "Search boxes", description = "Search boxes by location name or address")
    public ResponseEntity<List<Box>> searchBoxes(
            @RequestParam(required = false) String donationGroup,
            @RequestParam(required = false) String address) {

        List<Box> boxes;


        if (address != null && !address.isEmpty()) {
            boxes = boxService.searchBoxesByAddress(address);
        } else {
            boxes = boxService.getAllBoxes();
        }

        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    @GetMapping("/search/responsible-person")
    @Operation(summary = "Search boxes by responsible person", description = "Find boxes by the name of the responsible person")
    public ResponseEntity<List<Box>> searchBoxesByResponsiblePerson(@RequestParam String name) {
        List<Box> boxes = boxService.searchBoxesByResponsiblePerson(name);
        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    @GetMapping("/search/association-manager")
    @Operation(summary = "Search boxes by association manager", description = "Find boxes by the name of the association manager")
    public ResponseEntity<List<Box>> searchBoxesByAssociationManager(@RequestParam String name) {
        List<Box> boxes = boxService.searchBoxesByAssociationManager(name);
        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    @GetMapping("/donation-group/{group}")
    @Operation(summary = "Get boxes by donation group", description = "Find boxes by their donation group")
    public ResponseEntity<List<Box>> getBoxesByDonationGroup(@PathVariable String group) {
        List<Box> boxes = boxService.getBoxesByDonationGroup(group);
        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }

    // Enhanced search endpoint combining all search parameters
    @GetMapping("/advanced-search")
    @Operation(summary = "Advanced box search", description = "Search boxes using multiple criteria")
    public ResponseEntity<List<Box>> advancedSearch(
            @RequestParam(required = false) String donationGroup,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String responsiblePerson,
            @RequestParam(required = false) String associationManager,
            @RequestParam(required = false) Box.BoxStatus status) {

        // This is a simplified implementation. In a real-world scenario,
        // you would likely use a more sophisticated approach like Specification API
        // or a query builder to handle multiple criteria.

        List<Box> boxes;

        if (address != null && !address.isEmpty()) {
            boxes = boxService.searchBoxesByAddress(address);
        } else if (responsiblePerson != null && !responsiblePerson.isEmpty()) {
            boxes = boxService.searchBoxesByResponsiblePerson(responsiblePerson);
        } else if (associationManager != null && !associationManager.isEmpty()) {
            boxes = boxService.searchBoxesByAssociationManager(associationManager);
        } else if (donationGroup != null && !donationGroup.isEmpty()) {
            boxes = boxService.getBoxesByDonationGroup(donationGroup);
        } else if (status != null) {
            boxes = boxService.getBoxesByStatus(status);
        } else {
            boxes = boxService.getAllBoxes();
        }

        return new ResponseEntity<>(boxes, HttpStatus.OK);
    }
}