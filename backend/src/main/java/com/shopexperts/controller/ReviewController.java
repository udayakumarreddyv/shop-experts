package com.shopexperts.controller;

import com.shopexperts.payload.ReviewRequest;
import com.shopexperts.payload.ReviewResponse;
import com.shopexperts.security.CurrentUser;
import com.shopexperts.security.UserPrincipal;
import com.shopexperts.service.FileStorageService;
import com.shopexperts.service.ReviewService;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

  @Autowired private ReviewService reviewService;

  @Autowired private FileStorageService fileStorageService;

  @PostMapping
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<ReviewResponse> createReview(
      @Valid @RequestBody ReviewRequest reviewRequest, @CurrentUser UserPrincipal currentUser) {
    ReviewResponse review = reviewService.createReview(reviewRequest, currentUser.getId());
    return ResponseEntity.ok(review);
  }

  @PostMapping("/{reviewId}/photos")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Map<String, String>> uploadReviewPhoto(
      @PathVariable Long reviewId,
      @RequestParam("photo") MultipartFile photo,
      @CurrentUser UserPrincipal currentUser) {

    Map<String, String> response = new HashMap<>();

    try {
      // Validate file
      if (photo.isEmpty()) {
        response.put("error", "Please select a file to upload");
        return ResponseEntity.badRequest().body(response);
      }

      if (!fileStorageService.isValidImageFile(photo)) {
        response.put("error", "Only image files (JPEG, PNG, JPG, WEBP) are allowed");
        return ResponseEntity.badRequest().body(response);
      }

      // 5MB limit
      if (!fileStorageService.isValidFileSize(photo, 5 * 1024 * 1024)) {
        response.put("error", "File size must be less than 5MB");
        return ResponseEntity.badRequest().body(response);
      }

      // Store the file
      String filePath = fileStorageService.storeFile(photo, "reviews");

      // Add photo URL to review
      String photoUrl = "/uploads/" + filePath;
      reviewService.addPhotoToReview(reviewId, photoUrl, currentUser.getId());

      response.put("photoUrl", photoUrl);
      response.put("message", "Photo uploaded successfully");

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("error", "Failed to upload photo: " + e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @DeleteMapping("/{reviewId}/photos")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Map<String, String>> deleteReviewPhoto(
      @PathVariable Long reviewId,
      @RequestParam("photoUrl") String photoUrl,
      @CurrentUser UserPrincipal currentUser) {

    Map<String, String> response = new HashMap<>();

    try {
      boolean removed =
          reviewService.removePhotoFromReview(reviewId, photoUrl, currentUser.getId());

      if (removed) {
        // Try to delete the physical file
        String filePath = photoUrl.replace("/uploads/", "");
        fileStorageService.deleteFile(filePath);

        response.put("message", "Photo deleted successfully");
        return ResponseEntity.ok(response);
      } else {
        response.put("error", "Photo not found in review");
        return ResponseEntity.badRequest().body(response);
      }

    } catch (Exception e) {
      response.put("error", "Failed to delete photo: " + e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @GetMapping("/expert/{expertId}")
  public ResponseEntity<Page<ReviewResponse>> getExpertReviews(
      @PathVariable Long expertId, Pageable pageable) {
    Page<ReviewResponse> reviews = reviewService.getExpertReviews(expertId, pageable);
    return ResponseEntity.ok(reviews);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<Page<ReviewResponse>> getUserReviews(
      @PathVariable Long userId, Pageable pageable) {
    Page<ReviewResponse> reviews = reviewService.getUserReviews(userId, pageable);
    return ResponseEntity.ok(reviews);
  }

  @GetMapping("/{reviewId}")
  public ResponseEntity<ReviewResponse> getReview(@PathVariable Long reviewId) {
    // TODO: Implement single review retrieval
    return ResponseEntity.ok(new ReviewResponse());
  }

  @PutMapping("/{reviewId}")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<ReviewResponse> updateReview(
      @PathVariable Long reviewId,
      @Valid @RequestBody ReviewRequest reviewRequest,
      @CurrentUser UserPrincipal currentUser) {
    ReviewResponse review =
        reviewService.updateReview(reviewId, reviewRequest, currentUser.getId());
    return ResponseEntity.ok(review);
  }

  @DeleteMapping("/{reviewId}")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<?> deleteReview(
      @PathVariable Long reviewId, @CurrentUser UserPrincipal currentUser) {
    reviewService.deleteReview(reviewId, currentUser.getId());
    return ResponseEntity.ok().build();
  }

  @GetMapping("/expert/{expertId}/stats")
  public ResponseEntity<Map<String, Object>> getExpertReviewStats(@PathVariable Long expertId) {
    Map<String, Object> stats = new HashMap<>();
    stats.put("averageRating", reviewService.getExpertAverageRating(expertId));
    stats.put("totalReviews", reviewService.getExpertReviewCount(expertId));
    return ResponseEntity.ok(stats);
  }

  @PostMapping("/{reviewId}/helpful")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<?> markReviewHelpful(@PathVariable Long reviewId) {
    // TODO: Implement helpful marking functionality
    return ResponseEntity.ok().build();
  }
}
