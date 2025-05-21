package com.kesherManager.kesherManager.controller;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Transport;
import com.kesherManager.kesherManager.service.BoxService;
import com.kesherManager.kesherManager.service.TransportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transports")
@Tag(name = "Transport Controller", description = "API for managing food box transports")
public class TransportController {

    private final TransportService transportService;
    private final BoxService boxService;

    @Autowired
    public TransportController(TransportService transportService, BoxService boxService) {
        this.transportService = transportService;
        this.boxService = boxService;
    }

    @GetMapping
    @Operation(summary = "Get all transports", description = "Retrieve a list of all transports")
    public ResponseEntity<List<Transport>> getAllTransports() {
        List<Transport> transports = transportService.getAllTransports();
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transport by ID", description = "Retrieve a specific transport by its ID")
    public ResponseEntity<Transport> getTransportById(@PathVariable Long id) {
        Optional<Transport> transport = transportService.getTransportById(id);
        return transport.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @Operation(summary = "Create a new transport", description = "Add a new transport to the system")
    public ResponseEntity<Transport> createTransport(@Valid @RequestBody Transport transport) {
        // Validate that source box exists
        if (transport.getSourceBox() != null && transport.getSourceBox().getId() != null) {
            Optional<Box> sourceBox = boxService.getBoxById(transport.getSourceBox().getId());
            if (sourceBox.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Validate destination box if type is BOX
        if (transport.getDestinationType() == Transport.DestinationType.BOX &&
                transport.getDestinationBox() != null &&
                transport.getDestinationBox().getId() != null) {

            Optional<Box> destBox = boxService.getBoxById(transport.getDestinationBox().getId());
            if (destBox.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

        Transport savedTransport = transportService.saveTransport(transport);
        return new ResponseEntity<>(savedTransport, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a transport", description = "Update an existing transport details")
    public ResponseEntity<Transport> updateTransport(
            @PathVariable Long id,
            @Valid @RequestBody Transport transportDetails) {

        Optional<Transport> existingTransport = transportService.getTransportById(id);

        if (existingTransport.isPresent()) {
            Transport transport = existingTransport.get();

            // Validate source box
            if (transportDetails.getSourceBox() != null &&
                    transportDetails.getSourceBox().getId() != null) {
                Optional<Box> sourceBox = boxService.getBoxById(transportDetails.getSourceBox().getId());
                if (sourceBox.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                transport.setSourceBox(sourceBox.get());
            }

            // Validate destination box if type is BOX
            transport.setDestinationType(transportDetails.getDestinationType());

            if (transportDetails.getDestinationType() == Transport.DestinationType.BOX &&
                    transportDetails.getDestinationBox() != null &&
                    transportDetails.getDestinationBox().getId() != null) {

                Optional<Box> destBox = boxService.getBoxById(transportDetails.getDestinationBox().getId());
                if (destBox.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                transport.setDestinationBox(destBox.get());
            } else {
                transport.setDestinationId(transportDetails.getDestinationId());
                transport.setDestinationName(transportDetails.getDestinationName());
            }

            transport.setQuantity(transportDetails.getQuantity());
            transport.setScheduledDate(transportDetails.getScheduledDate());
            transport.setCompletionDate(transportDetails.getCompletionDate());
            transport.setStatus(transportDetails.getStatus());
            transport.setNotes(transportDetails.getNotes());

            Transport updatedTransport = transportService.saveTransport(transport);
            return new ResponseEntity<>(updatedTransport, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a transport", description = "Remove a transport from the system")
    public ResponseEntity<HttpStatus> deleteTransport(@PathVariable Long id) {
        try {
            transportService.deleteTransport(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update transport status", description = "Change the status of a transport")
    public ResponseEntity<Transport> updateTransportStatus(
            @PathVariable Long id,
            @RequestParam Transport.TransportStatus status) {

        try {
            Transport updatedTransport = transportService.updateStatus(id, status);
            return new ResponseEntity<>(updatedTransport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Complete a transport", description = "Mark a transport as completed with the completion date")
    public ResponseEntity<Transport> completeTransport(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date completionDate) {

        try {
            Transport completedTransport = transportService.completeTransport(id, completionDate);
            return new ResponseEntity<>(completedTransport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get transports by status", description = "Retrieve all transports with a specific status")
    public ResponseEntity<List<Transport>> getTransportsByStatus(
            @PathVariable Transport.TransportStatus status) {

        List<Transport> transports = transportService.getTransportsByStatus(status);
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's transports", description = "Retrieve all transports scheduled for today")
    public ResponseEntity<List<Transport>> getTodayTransports(
            @RequestParam(required = false) Transport.TransportStatus status) {

        List<Transport> transports;
        if (status != null) {
            transports = transportService.getTodayTransports(status);
        } else {
            // By default, show planned and in-progress transports
            transports = transportService.getTodayTransports(Transport.TransportStatus.PLANNED);
            transports.addAll(transportService.getTodayTransports(Transport.TransportStatus.IN_PROGRESS));
        }

        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get transports by date range", description = "Retrieve all transports scheduled within a date range")
    public ResponseEntity<List<Transport>> getTransportsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        List<Transport> transports = transportService.getTransportsByScheduledDateBetween(startDate, endDate);
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }
    @GetMapping("/source-donation-group/{group}")
    @Operation(summary = "Get transports by source donation group", description = "Find transports from boxes in a specific donation group")
    public ResponseEntity<List<Transport>> getTransportsBySourceDonationGroup(@PathVariable String group) {
        List<Transport> transports = transportService.getTransportsBySourceDonationGroup(group);
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @GetMapping("/destination-donation-group/{group}")
    @Operation(summary = "Get transports by destination donation group", description = "Find transports to boxes in a specific donation group")
    public ResponseEntity<List<Transport>> getTransportsByDestinationDonationGroup(@PathVariable String group) {
        List<Transport> transports = transportService.getTransportsByDestinationDonationGroup(group);
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @GetMapping("/driver/{name}")
    @Operation(summary = "Search transports by driver name", description = "Find transports assigned to a specific driver")
    public ResponseEntity<List<Transport>> searchTransportsByDriverName(@PathVariable String name) {
        List<Transport> transports = transportService.searchTransportsByDriverName(name);
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }
}