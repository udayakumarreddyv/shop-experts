package com.shopexperts.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RewardAccountResponse {
  private Long id;
  private Long userId;
  private String userName;
  private BigDecimal totalPoints;
  private BigDecimal availablePoints;
  private BigDecimal usedPoints;
  private String referralCode;
  private int totalReferrals;
  private LocalDateTime createdAt;
  private LocalDateTime lastUpdated;

  // Constructors
  public RewardAccountResponse() {}

  public RewardAccountResponse(
      Long id,
      Long userId,
      String userName,
      BigDecimal totalPoints,
      BigDecimal availablePoints,
      BigDecimal usedPoints,
      String referralCode,
      int totalReferrals,
      LocalDateTime createdAt,
      LocalDateTime lastUpdated) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.totalPoints = totalPoints;
    this.availablePoints = availablePoints;
    this.usedPoints = usedPoints;
    this.referralCode = referralCode;
    this.totalReferrals = totalReferrals;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public BigDecimal getTotalPoints() {
    return totalPoints;
  }

  public void setTotalPoints(BigDecimal totalPoints) {
    this.totalPoints = totalPoints;
  }

  public BigDecimal getAvailablePoints() {
    return availablePoints;
  }

  public void setAvailablePoints(BigDecimal availablePoints) {
    this.availablePoints = availablePoints;
  }

  public BigDecimal getUsedPoints() {
    return usedPoints;
  }

  public void setUsedPoints(BigDecimal usedPoints) {
    this.usedPoints = usedPoints;
  }

  public String getReferralCode() {
    return referralCode;
  }

  public void setReferralCode(String referralCode) {
    this.referralCode = referralCode;
  }

  public int getTotalReferrals() {
    return totalReferrals;
  }

  public void setTotalReferrals(int totalReferrals) {
    this.totalReferrals = totalReferrals;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getLastUpdated() {
    return lastUpdated;
  }

  public void setLastUpdated(LocalDateTime lastUpdated) {
    this.lastUpdated = lastUpdated;
  }
}
