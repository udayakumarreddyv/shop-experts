package com.shopexperts.payload;

import com.shopexperts.model.NotificationType;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class NotificationRequest {
  @NotNull private Long userId;

  @NotBlank(message = "Title is required")
  private String title;

  @NotBlank(message = "Message is required")
  private String message;

  @NotNull private NotificationType type;

  private String actionUrl;

  // Constructors
  public NotificationRequest() {}

  public NotificationRequest(Long userId, String title, String message, NotificationType type) {
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
  }

  // Getters and Setters
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
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
}
