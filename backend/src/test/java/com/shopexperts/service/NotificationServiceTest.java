package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.shopexperts.model.Notification;
import com.shopexperts.model.NotificationType;
import com.shopexperts.model.User;
import com.shopexperts.payload.NotificationRequest;
import com.shopexperts.payload.NotificationResponse;
import com.shopexperts.repository.NotificationRepository;
import com.shopexperts.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

  @Mock private NotificationRepository notificationRepository;

  @Mock private UserRepository userRepository;

  @InjectMocks private NotificationService notificationService;

  private User testUser;
  private Notification testNotification;
  private NotificationRequest notificationRequest;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId(1L);
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setEmail("john@example.com");

    testNotification = new Notification();
    testNotification.setId(1L);
    testNotification.setUser(testUser);
    testNotification.setTitle("Test Notification");
    testNotification.setMessage("Test message");
    testNotification.setType(NotificationType.BOOKING_CONFIRMED);
    testNotification.setIsRead(false);
    testNotification.setCreatedAt(LocalDateTime.now());

    notificationRequest = new NotificationRequest();
    notificationRequest.setUserId(1L);
    notificationRequest.setTitle("Test Notification");
    notificationRequest.setMessage("Test message");
    notificationRequest.setType(NotificationType.BOOKING_CONFIRMED);
  }

  @Test
  void createNotification_WithValidRequest_ShouldReturnNotificationResponse() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    NotificationResponse response = notificationService.createNotification(notificationRequest);

    // Assert
    assertNotNull(response);
    assertEquals(testNotification.getId(), response.getId());
    assertEquals(testNotification.getTitle(), response.getTitle());
    assertEquals(testNotification.getMessage(), response.getMessage());
    assertEquals(testNotification.getType(), response.getType());
    assertFalse(response.getIsRead());

    verify(userRepository).findById(1L);
    verify(notificationRepository).save(any(Notification.class));
  }

  @Test
  void createNotification_WithInvalidUserId_ShouldThrowException() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    RuntimeException exception =
        assertThrows(
            RuntimeException.class,
            () -> notificationService.createNotification(notificationRequest));

    assertEquals("User not found", exception.getMessage());
    verify(userRepository).findById(1L);
    verify(notificationRepository, never()).save(any(Notification.class));
  }

  @Test
  void createNotification_WithUserAndDetails_ShouldReturnNotification() {
    // Arrange
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    Notification result =
        notificationService.createNotification(
            testUser, "Test Title", "Test Message", NotificationType.BOOKING_CONFIRMED);

    // Assert
    assertNotNull(result);
    assertEquals(testNotification.getId(), result.getId());
    assertEquals(testNotification.getTitle(), result.getTitle());
    verify(notificationRepository).save(any(Notification.class));
  }

  @Test
  void getUserNotifications_WithValidUserId_ShouldReturnPagedNotifications() {
    // Arrange
    Pageable pageable = PageRequest.of(0, 10);
    Page<Notification> notificationPage = new PageImpl<>(Arrays.asList(testNotification));
    when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1L, pageable))
        .thenReturn(notificationPage);

    // Act
    Page<NotificationResponse> result = notificationService.getUserNotifications(1L, pageable);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());
    assertEquals(testNotification.getTitle(), result.getContent().get(0).getTitle());
    verify(notificationRepository).findByUserIdOrderByCreatedAtDesc(1L, pageable);
  }

  @Test
  void getUserNotifications_WithUser_ShouldReturnNotificationList() {
    // Arrange
    List<Notification> notifications = Arrays.asList(testNotification);
    when(notificationRepository.findByUserOrderByCreatedAtDesc(testUser)).thenReturn(notifications);

    // Act
    List<Notification> result = notificationService.getUserNotifications(testUser);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testNotification.getTitle(), result.get(0).getTitle());
    verify(notificationRepository).findByUserOrderByCreatedAtDesc(testUser);
  }

  @Test
  void getUnreadNotifications_WithUser_ShouldReturnUnreadNotifications() {
    // Arrange
    List<Notification> unreadNotifications = Arrays.asList(testNotification);
    when(notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(testUser, false))
        .thenReturn(unreadNotifications);

    // Act
    List<Notification> result = notificationService.getUnreadNotifications(testUser);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertFalse(result.get(0).getIsRead());
    verify(notificationRepository).findByUserAndIsReadOrderByCreatedAtDesc(testUser, false);
  }

  @Test
  void getUnreadNotificationCount_WithUserId_ShouldReturnCount() {
    // Arrange
    when(notificationRepository.countByUserIdAndIsRead(1L, false)).thenReturn(5L);

    // Act
    Long count = notificationService.getUnreadNotificationCount(1L);

    // Assert
    assertEquals(5L, count);
    verify(notificationRepository).countByUserIdAndIsRead(1L, false);
  }

  @Test
  void getUnreadNotificationCount_WithUser_ShouldReturnCount() {
    // Arrange
    when(notificationRepository.countByUserAndIsRead(testUser, false)).thenReturn(3L);

    // Act
    Long count = notificationService.getUnreadNotificationCount(testUser);

    // Assert
    assertEquals(3L, count);
    verify(notificationRepository).countByUserAndIsRead(testUser, false);
  }

  @Test
  void markNotificationAsRead_WithValidId_ShouldMarkAsRead() {
    // Arrange
    when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    notificationService.markNotificationAsRead(1L);

    // Assert
    verify(notificationRepository).findById(1L);
    verify(notificationRepository).save(any(Notification.class));
  }

  @Test
  void markNotificationAsRead_WithInvalidId_ShouldThrowException() {
    // Arrange
    when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    RuntimeException exception =
        assertThrows(RuntimeException.class, () -> notificationService.markNotificationAsRead(1L));

    assertEquals("Notification not found", exception.getMessage());
    verify(notificationRepository).findById(1L);
    verify(notificationRepository, never()).save(any(Notification.class));
  }

  @Test
  void markAsRead_WithValidId_ShouldCallMarkNotificationAsRead() {
    // Arrange
    when(notificationRepository.findById(1L)).thenReturn(Optional.of(testNotification));
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    notificationService.markAsRead(1L);

    // Assert
    verify(notificationRepository).findById(1L);
    verify(notificationRepository).save(any(Notification.class));
  }

  @Test
  void markAllNotificationsAsRead_WithUserId_ShouldMarkAllAsRead() {
    // Arrange
    List<Notification> unreadNotifications = Arrays.asList(testNotification);
    when(notificationRepository.findByUserIdAndIsRead(1L, false)).thenReturn(unreadNotifications);
    when(notificationRepository.saveAll(anyList())).thenReturn(unreadNotifications);

    // Act
    notificationService.markAllNotificationsAsRead(1L);

    // Assert
    verify(notificationRepository).findByUserIdAndIsRead(1L, false);
    verify(notificationRepository).saveAll(anyList());
  }

  @Test
  void markAllAsRead_WithUser_ShouldMarkAllAsRead() {
    // Arrange
    List<Notification> unreadNotifications = Arrays.asList(testNotification);
    when(notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(testUser, false))
        .thenReturn(unreadNotifications);
    when(notificationRepository.saveAll(anyList())).thenReturn(unreadNotifications);

    // Act
    notificationService.markAllAsRead(testUser);

    // Assert
    verify(notificationRepository).findByUserAndIsReadOrderByCreatedAtDesc(testUser, false);
    verify(notificationRepository).saveAll(anyList());
  }

  @Test
  void deleteNotification_WithValidId_ShouldDeleteNotification() {
    // Arrange
    doNothing().when(notificationRepository).deleteById(1L);

    // Act
    notificationService.deleteNotification(1L);

    // Assert
    verify(notificationRepository).deleteById(1L);
  }

  @Test
  void sendBulkNotification_ShouldCreateNotificationForAllUsers() {
    // Arrange
    User user2 = new User();
    user2.setId(2L);
    user2.setFirstName("Jane");
    user2.setLastName("Doe");

    List<User> users = Arrays.asList(testUser, user2);
    when(userRepository.findAll()).thenReturn(users);
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    notificationService.sendBulkNotification(notificationRequest);

    // Assert
    verify(userRepository).findAll();
    verify(notificationRepository, times(2)).save(any(Notification.class));
  }

  @Test
  void sendPromotionNotification_ShouldCreatePromotionNotification() {
    // Arrange
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    notificationService.sendPromotionNotification(testUser, "Promotion Title", "Promotion Message");

    // Assert
    verify(notificationRepository)
        .save(
            argThat(
                notification ->
                    notification.getType() == NotificationType.PROMOTION
                        && notification.getTitle().equals("Promotion Title")
                        && notification.getMessage().equals("Promotion Message")));
  }

  @Test
  void sendSystemAlert_ShouldCreateSystemAlertNotification() {
    // Arrange
    when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

    // Act
    notificationService.sendSystemAlert(testUser, "Alert Title", "Alert Message");

    // Assert
    verify(notificationRepository)
        .save(
            argThat(
                notification ->
                    notification.getType() == NotificationType.SYSTEM_ALERT
                        && notification.getTitle().equals("Alert Title")
                        && notification.getMessage().equals("Alert Message")));
  }
}
