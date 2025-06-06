package com.shopexperts.payload;

import com.shopexperts.model.TransactionType;
import java.math.BigDecimal;

public class RewardTransactionRequest {
  private Long userId;
  private TransactionType type;
  private BigDecimal amount;
  private String description;
  private String referenceId;

  // Constructors
  public RewardTransactionRequest() {}

  public RewardTransactionRequest(
      Long userId,
      TransactionType type,
      BigDecimal amount,
      String description,
      String referenceId) {
    this.userId = userId;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.referenceId = referenceId;
  }

  // Getters and Setters
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
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
}
