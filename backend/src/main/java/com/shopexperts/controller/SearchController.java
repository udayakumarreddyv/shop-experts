package com.shopexperts.controller;

import com.shopexperts.model.User;
import com.shopexperts.payload.ApiResponse;
import com.shopexperts.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {

  @Autowired private UserService userService;

  @GetMapping("/talents")
  public ResponseEntity<?> searchTalents(
      @RequestParam(required = false) String location,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String skills) {

    try {
      List<User> talents = userService.searchTalents(location, category, skills);
      return ResponseEntity.ok(talents);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Search failed: " + e.getMessage()));
    }
  }

  @GetMapping("/talents/nearby")
  public ResponseEntity<?> findNearbyTalents(
      @RequestParam Double latitude,
      @RequestParam Double longitude,
      @RequestParam(defaultValue = "10.0") Double radius) {

    try {
      List<User> talents = userService.findTalentsNearLocation(latitude, longitude, radius);
      return ResponseEntity.ok(talents);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Location search failed: " + e.getMessage()));
    }
  }

  @GetMapping("/talents/all")
  public ResponseEntity<?> getAllTalents() {
    try {
      List<User> talents = userService.getAllTalents();
      return ResponseEntity.ok(talents);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Failed to fetch talents: " + e.getMessage()));
    }
  }
}
