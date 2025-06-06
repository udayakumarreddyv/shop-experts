package com.shopexperts.payload.request;

import java.time.LocalDateTime;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class BookingRequest {
  @NotNull private Long expertId;

  @Size(max = 50)
  private String serviceType;

  @Size(max = 255)
  private String serviceDescription;

  @NotNull private LocalDateTime bookingDate;

  private Double price;

  public Long getExpertId() {
    return expertId;
  }

  public void setExpertId(Long expertId) {
    this.expertId = expertId;
  }

  public String getServiceType() {
    return serviceType;
  }

  public void setServiceType(String serviceType) {
    this.serviceType = serviceType;
  }

  public String getServiceDescription() {
    return serviceDescription;
  }

  public void setServiceDescription(String serviceDescription) {
    this.serviceDescription = serviceDescription;
  }

  public LocalDateTime getBookingDate() {
    return bookingDate;
  }

  public void setBookingDate(LocalDateTime bookingDate) {
    this.bookingDate = bookingDate;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }
}
