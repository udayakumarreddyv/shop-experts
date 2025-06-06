package com.shopexperts.service;

import com.shopexperts.model.Review;
import com.shopexperts.model.User;
import com.shopexperts.payload.ReviewRequest;
import com.shopexperts.payload.ReviewResponse;
import com.shopexperts.repository.ReviewRepository;
import com.shopexperts.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReviewService {

  @Autowired private ReviewRepository reviewRepository;

  @Autowired private UserRepository userRepository;

  public ReviewResponse createReview(ReviewRequest reviewRequest, Long reviewerId) {
    User reviewer =
        userRepository
            .findById(reviewerId)
            .orElseThrow(() -> new RuntimeException("Reviewer not found"));

    User expert =
        userRepository
            .findById(reviewRequest.getExpertId())
            .orElseThrow(() -> new RuntimeException("Expert not found"));

    Review review = new Review();
    review.setReviewer(reviewer);
    review.setExpert(expert);
    review.setRating(reviewRequest.getRating());
    review.setComment(reviewRequest.getComment());
    review.setCreatedAt(LocalDateTime.now());
    review.setUpdatedAt(LocalDateTime.now());

    review = reviewRepository.save(review);
    return convertToResponse(review);
  }

  public Page<ReviewResponse> getExpertReviews(Long expertId, Pageable pageable) {
    Page<Review> reviews = reviewRepository.findByTalentIdOrderByCreatedAtDesc(expertId, pageable);
    return reviews.map(this::convertToResponse);
  }

  public Page<ReviewResponse> getUserReviews(Long userId, Pageable pageable) {
    Page<Review> reviews = reviewRepository.findByReviewerIdOrderByCreatedAtDesc(userId, pageable);
    return reviews.map(this::convertToResponse);
  }

  public Double getExpertAverageRating(Long expertId) {
    return reviewRepository.findAverageRatingByTalentId(expertId);
  }

  public Long getExpertReviewCount(Long expertId) {
    return reviewRepository.countByTalentId(expertId);
  }

  public List<ReviewResponse> getRecentReviews(int limit) {
    List<Review> reviews = reviewRepository.findTop10ByOrderByCreatedAtDesc();
    return reviews.stream().limit(limit).map(this::convertToResponse).collect(Collectors.toList());
  }

  public ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest, Long reviewerId) {
    Review review =
        reviewRepository
            .findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    if (!review.getReviewer().getId().equals(reviewerId)) {
      throw new RuntimeException("You can only update your own reviews");
    }

    review.setRating(reviewRequest.getRating());
    review.setComment(reviewRequest.getComment());
    review.setUpdatedAt(LocalDateTime.now());

    review = reviewRepository.save(review);
    return convertToResponse(review);
  }

  public void deleteReview(Long reviewId, Long reviewerId) {
    Review review =
        reviewRepository
            .findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    if (!review.getReviewer().getId().equals(reviewerId)) {
      throw new RuntimeException("You can only delete your own reviews");
    }

    reviewRepository.delete(review);
  }

  public boolean hasUserReviewedExpert(Long reviewerId, Long expertId) {
    return reviewRepository.existsByReviewerIdAndTalentId(reviewerId, expertId);
  }

  public String addPhotoToReview(Long reviewId, String photoUrl, Long userId) {
    Review review =
        reviewRepository
            .findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    // Verify the user owns this review
    if (!review.getReviewer().getId().equals(userId)) {
      throw new RuntimeException("You can only add photos to your own reviews");
    }

    // Add photo URL to the review
    review.getPhotoUrls().add(photoUrl);
    reviewRepository.save(review);

    return photoUrl;
  }

  public boolean removePhotoFromReview(Long reviewId, String photoUrl, Long userId) {
    Review review =
        reviewRepository
            .findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    // Verify the user owns this review
    if (!review.getReviewer().getId().equals(userId)) {
      throw new RuntimeException("You can only remove photos from your own reviews");
    }

    // Remove photo URL from the review
    boolean removed = review.getPhotoUrls().remove(photoUrl);
    if (removed) {
      reviewRepository.save(review);
    }

    return removed;
  }

  private ReviewResponse convertToResponse(Review review) {
    ReviewResponse response =
        new ReviewResponse(
            review.getId(),
            review.getReviewer().getId(),
            review.getReviewer().getName(),
            review.getTalent().getId(),
            review.getTalent().getName(),
            review.getRating(),
            review.getComment(),
            review.getCreatedAt(),
            review.getUpdatedAt());

    // Set photo URLs
    if (review.getPhotoUrls() != null && !review.getPhotoUrls().isEmpty()) {
      response.setPhotoUrls(new java.util.ArrayList<>(review.getPhotoUrls()));
    }

    return response;
  }
}
