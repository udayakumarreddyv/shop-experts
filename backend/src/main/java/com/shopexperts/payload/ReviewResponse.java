package com.shopexperts.payload;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewResponse {
  private Long id;
  private Long bookingId;
  private Long expertId;
  private String expertName;
  private Long customerId;
  private String customerName;
  private String customerProfileImage;
  private Integer rating;
  private String comment;
  private List<String> photoUrls;
  private Integer helpfulCount;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Constructors
  public ReviewResponse() {}

  public ReviewResponse(
      Long id,
      Long reviewerId,
      String reviewerName,
      Long expertId,
      String expertName,
      Integer rating,
      String comment,
      LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.customerId = reviewerId;
    this.customerName = reviewerName;
    this.expertId = expertId;
    this.expertName = expertName;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
  }

  public Long getExpertId() {
    return expertId;
  }

  public void setExpertId(Long expertId) {
    this.expertId = expertId;
  }

  public String getExpertName() {
    return expertName;
  }

  public void setExpertName(String expertName) {
    this.expertName = expertName;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public String getCustomerProfileImage() {
    return customerProfileImage;
  }

  public void setCustomerProfileImage(String customerProfileImage) {
    this.customerProfileImage = customerProfileImage;
  }

  public Integer getRating() {
    return rating;
  }

  public void setRating(Integer rating) {
    this.rating = rating;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public List<String> getPhotoUrls() {
    return photoUrls;
  }

  public void setPhotoUrls(List<String> photoUrls) {
    this.photoUrls = photoUrls;
  }

  public Integer getHelpfulCount() {
    return helpfulCount;
  }

  public void setHelpfulCount(Integer helpfulCount) {
    this.helpfulCount = helpfulCount;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
