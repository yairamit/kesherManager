package com.kesherManager.kesherManager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.service.BoxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/import")
@Tag(name = "Import Controller", description = "API for importing data into the system")
public class ImportController {

    private final BoxService boxService;
    private final ObjectMapper objectMapper;

    @Autowired
    public ImportController(BoxService boxService, ObjectMapper objectMapper) {
        this.boxService = boxService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/boxes")
    @Operation(summary = "Import boxes", description = "Import boxes from JSON file")
    public ResponseEntity<Map<String, Object>> importBoxes(@RequestParam("file") MultipartFile file) {
        try {
            // Read the JSON file
            String jsonContent = new String(file.getBytes());

            // Parse JSON to list of boxes
            List<Map<String, Object>> boxesData = objectMapper.readValue(
                    jsonContent,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class)
            );

            List<Box> importedBoxes = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            // Process each box entry
            for (int i = 0; i < boxesData.size(); i++) {
                Map<String, Object> boxData = boxesData.get(i);
                try {
                    Box box = new Box();

                    // Set fields from the JSON data
                    if (boxData.containsKey("locationName")) {
                        box.setLocationName((String) boxData.get("locationName"));
                    } else {
                        throw new IllegalArgumentException("Location name is required");
                    }

                    if (boxData.containsKey("address")) {
                        box.setAddress((String) boxData.get("address"));
                    }

                    if (boxData.containsKey("responsiblePerson")) {
                        box.setResponsiblePerson((String) boxData.get("responsiblePerson"));
                    }

                    if (boxData.containsKey("responsiblePersonPhone")) {
                        box.setResponsiblePersonPhone((String) boxData.get("responsiblePersonPhone"));
                    }

                    if (boxData.containsKey("associationManager")) {
                        box.setAssociationManager((String) boxData.get("associationManager"));
                    }

                    if (boxData.containsKey("donationGroup")) {
                        box.setDonationGroup((String) boxData.get("donationGroup"));
                    }

                    if (boxData.containsKey("notes")) {
                        box.setNotes((String) boxData.get("notes"));
                    }

                    if (boxData.containsKey("status")) {
                        String statusStr = (String) boxData.get("status");
                        if (statusStr != null && !statusStr.isEmpty()) {
                            try {
                                box.setStatus(Box.BoxStatus.valueOf(statusStr.toUpperCase()));
                            } catch (IllegalArgumentException e) {
                                box.setStatus(Box.BoxStatus.ACTIVE); // Default to ACTIVE if invalid status
                            }
                        } else {
                            box.setStatus(Box.BoxStatus.ACTIVE); // Default status
                        }
                    } else {
                        box.setStatus(Box.BoxStatus.ACTIVE); // Default status
                    }

                    if (boxData.containsKey("latitude") && boxData.get("latitude") != null) {
                        if (boxData.get("latitude") instanceof Number) {
                            box.setLatitude(((Number) boxData.get("latitude")).doubleValue());
                        } else if (boxData.get("latitude") instanceof String) {
                            try {
                                box.setLatitude(Double.parseDouble((String) boxData.get("latitude")));
                            } catch (NumberFormatException e) {
                                // Skip latitude if it's not a valid number
                            }
                        }
                    }

                    if (boxData.containsKey("longitude") && boxData.get("longitude") != null) {
                        if (boxData.get("longitude") instanceof Number) {
                            box.setLongitude(((Number) boxData.get("longitude")).doubleValue());
                        } else if (boxData.get("longitude") instanceof String) {
                            try {
                                box.setLongitude(Double.parseDouble((String) boxData.get("longitude")));
                            } catch (NumberFormatException e) {
                                // Skip longitude if it's not a valid number
                            }
                        }
                    }

                    // Save the box to the database
                    Box savedBox = boxService.saveBox(box);
                    importedBoxes.add(savedBox);

                } catch (Exception e) {
                    errors.add("Error importing box at index " + i + ": " + e.getMessage());
                }
            }

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("totalProcessed", boxesData.size());
            response.put("successfulImports", importedBoxes.size());
            response.put("errors", errors);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to parse JSON file: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/boxes/json")
    @Operation(summary = "Import boxes from JSON", description = "Import boxes from JSON payload")
    public ResponseEntity<Map<String, Object>> importBoxesFromJson(@RequestBody List<Map<String, Object>> boxesData) {
        List<Box> importedBoxes = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // Process each box entry
        for (int i = 0; i < boxesData.size(); i++) {
            Map<String, Object> boxData = boxesData.get(i);
            try {
                Box box = new Box();

                // Set fields from the JSON data (same as above)
                if (boxData.containsKey("locationName")) {
                    box.setLocationName((String) boxData.get("locationName"));
                } else {
                    throw new IllegalArgumentException("Location name is required");
                }

                if (boxData.containsKey("address")) {
                    box.setAddress((String) boxData.get("address"));
                }

                if (boxData.containsKey("responsiblePerson")) {
                    box.setResponsiblePerson((String) boxData.get("responsiblePerson"));
                }

                if (boxData.containsKey("responsiblePersonPhone")) {
                    box.setResponsiblePersonPhone((String) boxData.get("responsiblePersonPhone"));
                }

                if (boxData.containsKey("associationManager")) {
                    box.setAssociationManager((String) boxData.get("associationManager"));
                }

                if (boxData.containsKey("donationGroup")) {
                    box.setDonationGroup((String) boxData.get("donationGroup"));
                }

                if (boxData.containsKey("notes")) {
                    box.setNotes((String) boxData.get("notes"));
                }

                if (boxData.containsKey("status")) {
                    String statusStr = (String) boxData.get("status");
                    if (statusStr != null && !statusStr.isEmpty()) {
                        try {
                            box.setStatus(Box.BoxStatus.valueOf(statusStr.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            box.setStatus(Box.BoxStatus.ACTIVE); // Default to ACTIVE if invalid status
                        }
                    } else {
                        box.setStatus(Box.BoxStatus.ACTIVE); // Default status
                    }
                } else {
                    box.setStatus(Box.BoxStatus.ACTIVE); // Default status
                }

                if (boxData.containsKey("latitude") && boxData.get("latitude") != null) {
                    if (boxData.get("latitude") instanceof Number) {
                        box.setLatitude(((Number) boxData.get("latitude")).doubleValue());
                    } else if (boxData.get("latitude") instanceof String) {
                        try {
                            box.setLatitude(Double.parseDouble((String) boxData.get("latitude")));
                        } catch (NumberFormatException e) {
                            // Skip latitude if it's not a valid number
                        }
                    }
                }

                if (boxData.containsKey("longitude") && boxData.get("longitude") != null) {
                    if (boxData.get("longitude") instanceof Number) {
                        box.setLongitude(((Number) boxData.get("longitude")).doubleValue());
                    } else if (boxData.get("longitude") instanceof String) {
                        try {
                            box.setLongitude(Double.parseDouble((String) boxData.get("longitude")));
                        } catch (NumberFormatException e) {
                            // Skip longitude if it's not a valid number
                        }
                    }
                }

                // Save the box to the database
                Box savedBox = boxService.saveBox(box);
                importedBoxes.add(savedBox);

            } catch (Exception e) {
                errors.add("Error importing box at index " + i + ": " + e.getMessage());
            }
        }

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("totalProcessed", boxesData.size());
        response.put("successfulImports", importedBoxes.size());
        response.put("errors", errors);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}