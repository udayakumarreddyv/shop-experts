package com.shopexperts.payload;

import com.shopexperts.model.NotificationType;
import java.time.LocalDateTime;

public class NotificationResponse {
  private Long id;
  private String title;
  private String message;
  private NotificationType type;
  private String actionUrl;
  private Boolean isRead;
  private LocalDateTime createdAt;

  // Constructors
  public NotificationResponse() {}

  public NotificationResponse(
      Long id,
      Long userId,
      String userName,
      String title,
      String message,
      NotificationType type,
      Boolean isRead,
      LocalDateTime createdAt) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.createdAt = createdAt;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public NotificationType getType() {
    return type;
  }

  public void setType(NotificationType type) {
    this.type = type;
  }

  public String getActionUrl() {
    return actionUrl;
  }

  public void setActionUrl(String actionUrl) {
    this.actionUrl = actionUrl;
  }

  public Boolean getIsRead() {
    return isRead;
  }

  public void setIsRead(Boolean isRead) {
    this.isRead = isRead;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
