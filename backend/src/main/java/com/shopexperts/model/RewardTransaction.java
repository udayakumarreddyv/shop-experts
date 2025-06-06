package com.shopexperts.model;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "reward_transactions")
public class RewardTransaction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reward_account_id")
  private RewardAccount rewardAccount;

  @Enumerated(EnumType.STRING)
  private TransactionType type;

  private Integer points;
  private String description;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public RewardAccount getRewardAccount() {
    return rewardAccount;
  }

  public void setRewardAccount(RewardAccount rewardAccount) {
    this.rewardAccount = rewardAccount;
  }

  public TransactionType getType() {
    return type;
  }

  public void setType(TransactionType type) {
    this.type = type;
  }

  public Integer getPoints() {
    return points;
  }

  public void setPoints(Integer points) {
    this.points = points;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
