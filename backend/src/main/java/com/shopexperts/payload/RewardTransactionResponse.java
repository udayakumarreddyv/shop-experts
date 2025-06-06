package com.shopexperts.payload;

import com.shopexperts.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RewardTransactionResponse {
  private Long id;
  private Long userId;
  private String userName;
  private TransactionType type;
  private BigDecimal amount;
  private String description;
  private String referenceId;
  private LocalDateTime createdAt;

  // Constructors
  public RewardTransactionResponse() {}

  public RewardTransactionResponse(
      Long id,
      Long userId,
      String userName,
      TransactionType type,
      BigDecimal amount,
      String description,
      String referenceId,
      LocalDateTime createdAt) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.referenceId = referenceId;
    this.createdAt = createdAt;
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

  public TransactionType getType() {
    return type;
  }

  public void setType(TransactionType type) {
    this.type = type;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getReferenceId() {
    return referenceId;
  }

  public void setReferenceId(String referenceId) {
    this.referenceId = referenceId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
