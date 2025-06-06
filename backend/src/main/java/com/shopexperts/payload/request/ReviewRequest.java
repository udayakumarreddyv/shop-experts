package com.shopexperts.payload.request;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class ReviewRequest {
  @NotNull private Long bookingId;

  @NotNull
  @Min(value = 1, message = "Rating must be at least 1")
  @Max(value = 5, message = "Rating must be at most 5")
  private Integer rating;

  @NotBlank(message = "Comment is required")
  private String comment;

  // Constructors
  public ReviewRequest() {}

  public ReviewRequest(Long bookingId, Integer rating, String comment) {
    this.bookingId = bookingId;
    this.rating = rating;
    this.comment = comment;
  }

  // Getters and Setters
  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
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
}
