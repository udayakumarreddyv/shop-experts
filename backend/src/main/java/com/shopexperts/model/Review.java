package com.shopexperts.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reviewer_id")
  private User reviewer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "talent_id")
  private User talent;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "booking_id")
  private Booking booking;

  private Integer rating; // 1-5 stars

  @Column(columnDefinition = "TEXT")
  private String comment;

  @ElementCollection
  @CollectionTable(name = "review_photos", joinColumns = @JoinColumn(name = "review_id"))
  @Column(name = "photo_url")
  private Set<String> photoUrls = new HashSet<>();

  private Boolean verified = false;
  private Boolean approved = true;

  @Column(name = "helpful_votes")
  private Integer helpfulVotes = 0;

  @Column(name = "expert_reply")
  private String expertReply;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getReviewer() {
    return reviewer;
  }

  public void setReviewer(User reviewer) {
    this.reviewer = reviewer;
  }

  public User getTalent() {
    return talent;
  }

  public void setTalent(User talent) {
    this.talent = talent;
  }

  // Alias methods for compatibility
  public User getExpert() {
    return talent;
  }

  public void setExpert(User expert) {
    this.talent = expert;
  }

  public Booking getBooking() {
    return booking;
  }

  public void setBooking(Booking booking) {
    this.booking = booking;
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

  public Set<String> getPhotoUrls() {
    return photoUrls;
  }

  public void setPhotoUrls(Set<String> photoUrls) {
    this.photoUrls = photoUrls;
  }

  public Boolean getVerified() {
    return verified;
  }

  public void setVerified(Boolean verified) {
    this.verified = verified;
  }

  public Boolean getApproved() {
    return approved;
  }

  public void setApproved(Boolean approved) {
    this.approved = approved;
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

  public Integer getHelpfulVotes() {
    return helpfulVotes;
  }

  public void setHelpfulVotes(Integer helpfulVotes) {
    this.helpfulVotes = helpfulVotes;
  }

  public String getExpertReply() {
    return expertReply;
  }

  public void setExpertReply(String expertReply) {
    this.expertReply = expertReply;
  }
}
