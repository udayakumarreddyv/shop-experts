package com.shopexperts.service;

import com.shopexperts.model.Notification;
import com.shopexperts.model.NotificationType;
import com.shopexperts.model.User;
import com.shopexperts.payload.NotificationRequest;
import com.shopexperts.payload.NotificationResponse;
import com.shopexperts.repository.NotificationRepository;
import com.shopexperts.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  @Autowired private NotificationRepository notificationRepository;

  @Autowired private UserRepository userRepository;

  public NotificationResponse createNotification(NotificationRequest request) {
    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Notification notification = new Notification();
    notification.setUser(user);
    notification.setTitle(request.getTitle());
    notification.setMessage(request.getMessage());
    notification.setType(request.getType());
    notification.setIsRead(false);
    notification.setCreatedAt(LocalDateTime.now());

    notification = notificationRepository.save(notification);
    return convertToResponse(notification);
  }

  public Notification createNotification(
      User user, String title, String message, NotificationType type) {
    Notification notification = new Notification();
    notification.setUser(user);
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setType(type);
    notification.setIsRead(false);
    notification.setCreatedAt(LocalDateTime.now());

    return notificationRepository.save(notification);
  }

  public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
    Page<Notification> notifications =
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    return notifications.map(this::convertToResponse);
  }

  public List<Notification> getUserNotifications(User user) {
    return notificationRepository.findByUserOrderByCreatedAtDesc(user);
  }

  public List<Notification> getUnreadNotifications(User user) {
    return notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
  }

  public Long getUnreadNotificationCount(Long userId) {
    return notificationRepository.countByUserIdAndIsRead(userId, false);
  }

  public Long getUnreadNotificationCount(User user) {
    return notificationRepository.countByUserAndIsRead(user, false);
  }

  public void markNotificationAsRead(Long notificationId) {
    Notification notification =
        notificationRepository
            .findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

    notification.setIsRead(true);
    notificationRepository.save(notification);
  }

  public void markAsRead(Long notificationId) {
    markNotificationAsRead(notificationId);
  }

  public void markAllNotificationsAsRead(Long userId) {
    List<Notification> notifications = notificationRepository.findByUserIdAndIsRead(userId, false);
    notifications.forEach(notification -> notification.setIsRead(true));
    notificationRepository.saveAll(notifications);
  }

  public void markAllAsRead(User user) {
    List<Notification> notifications =
        notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
    notifications.forEach(notification -> notification.setIsRead(true));
    notificationRepository.saveAll(notifications);
  }

  public void deleteNotification(Long notificationId) {
    notificationRepository.deleteById(notificationId);
  }

  public void sendBulkNotification(NotificationRequest request) {
    // Implementation for bulk notification
    // This would send notifications to multiple users
    List<User> users = userRepository.findAll(); // Or filter based on criteria

    for (User user : users) {
      createNotification(user, request.getTitle(), request.getMessage(), request.getType());
    }
  }

  private NotificationResponse convertToResponse(Notification notification) {
    return new NotificationResponse(
        notification.getId(),
        notification.getUser().getId(),
        notification.getUser().getName(),
        notification.getTitle(),
        notification.getMessage(),
        notification.getType(),
        notification.getIsRead(),
        notification.getCreatedAt());
  }

  public void sendPromotionNotification(User user, String promotionTitle, String promotionMessage) {
    createNotification(user, promotionTitle, promotionMessage, NotificationType.PROMOTION);
  }

  public void sendSystemAlert(User user, String alertTitle, String alertMessage) {
    createNotification(user, alertTitle, alertMessage, NotificationType.SYSTEM_ALERT);
  }
}
