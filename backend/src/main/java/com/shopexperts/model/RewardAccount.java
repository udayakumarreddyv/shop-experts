package com.shopexperts.model;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "reward_accounts")
public class RewardAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  private Integer totalPoints = 0;
  private Integer availablePoints = 0;
  private Integer redeemedPoints = 0;

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

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Integer getTotalPoints() {
    return totalPoints;
  }

  public void setTotalPoints(Integer totalPoints) {
    this.totalPoints = totalPoints;
  }

  public Integer getAvailablePoints() {
    return availablePoints;
  }

  public void setAvailablePoints(Integer availablePoints) {
    this.availablePoints = availablePoints;
  }

  public Integer getRedeemedPoints() {
    return redeemedPoints;
  }

  public void setRedeemedPoints(Integer redeemedPoints) {
    this.redeemedPoints = redeemedPoints;
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
