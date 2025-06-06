package com.shopexperts.controller;

import com.shopexperts.payload.NotificationRequest;
import com.shopexperts.payload.NotificationResponse;
import com.shopexperts.security.CurrentUser;
import com.shopexperts.security.UserPrincipal;
import com.shopexperts.service.NotificationService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

  @Autowired private NotificationService notificationService;

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<NotificationResponse> createNotification(
      @Valid @RequestBody NotificationRequest request) {
    NotificationResponse notification = notificationService.createNotification(request);
    return ResponseEntity.ok(notification);
  }

  @GetMapping("/user/{userId}")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
      @PathVariable Long userId, Pageable pageable) {
    Page<NotificationResponse> notifications =
        notificationService.getUserNotifications(userId, pageable);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<Page<NotificationResponse>> getMyNotifications(
      @CurrentUser UserPrincipal currentUser, Pageable pageable) {
    Page<NotificationResponse> notifications =
        notificationService.getUserNotifications(currentUser.getId(), pageable);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/unread/count")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<Long> getUnreadNotificationCount(@CurrentUser UserPrincipal currentUser) {
    Long count = notificationService.getUnreadNotificationCount(currentUser.getId());
    return ResponseEntity.ok(count);
  }

  @PutMapping("/{notificationId}/read")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<?> markNotificationAsRead(@PathVariable Long notificationId) {
    notificationService.markNotificationAsRead(notificationId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/mark-all-read")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<?> markAllNotificationsAsRead(@CurrentUser UserPrincipal currentUser) {
    notificationService.markAllNotificationsAsRead(currentUser.getId());
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{notificationId}")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT') or hasRole('ADMIN')")
  public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
    notificationService.deleteNotification(notificationId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/send-bulk")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> sendBulkNotification(@Valid @RequestBody NotificationRequest request) {
    notificationService.sendBulkNotification(request);
    return ResponseEntity.ok().build();
  }
}
