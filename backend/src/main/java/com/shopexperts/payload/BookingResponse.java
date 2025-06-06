package com.shopexperts.payload;

import com.shopexperts.model.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
  private Long id;
  private Long customerId;
  private String customerName;
  private Long expertId;
  private String expertName;
  private String serviceTitle;
  private String serviceDescription;
  private BigDecimal price;
  private LocalDateTime scheduledDate;
  private BookingStatus status;
  private String location;
  private String notes;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Constructors
  public BookingResponse() {}

  public BookingResponse(
      Long id,
      Long customerId,
      String customerName,
      Long expertId,
      String expertName,
      String serviceTitle,
      String serviceDescription,
      BigDecimal price,
      LocalDateTime scheduledDate,
      BookingStatus status,
      String location,
      String notes,
      LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.customerId = customerId;
    this.customerName = customerName;
    this.expertId = expertId;
    this.expertName = expertName;
    this.serviceTitle = serviceTitle;
    this.serviceDescription = serviceDescription;
    this.price = price;
    this.scheduledDate = scheduledDate;
    this.status = status;
    this.location = location;
    this.notes = notes;
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

  public String getServiceTitle() {
    return serviceTitle;
  }

  public void setServiceTitle(String serviceTitle) {
    this.serviceTitle = serviceTitle;
  }

  public String getServiceDescription() {
    return serviceDescription;
  }

  public void setServiceDescription(String serviceDescription) {
    this.serviceDescription = serviceDescription;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public LocalDateTime getScheduledDate() {
    return scheduledDate;
  }

  public void setScheduledDate(LocalDateTime scheduledDate) {
    this.scheduledDate = scheduledDate;
  }

  public BookingStatus getStatus() {
    return status;
  }

  public void setStatus(BookingStatus status) {
    this.status = status;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
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
