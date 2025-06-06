package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.shopexperts.model.*;
import com.shopexperts.repository.BookingRepository;
import com.shopexperts.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

  @Mock private BookingRepository bookingRepository;

  @Mock private UserRepository userRepository;

  @Mock private PaymentService paymentService;

  @Mock private NotificationService notificationService;

  @Mock private RewardService rewardService;

  @InjectMocks private BookingService bookingService;

  private User testUser;
  private User testTalent;
  private Booking testBooking;
  private LocalDateTime startTime;
  private LocalDateTime endTime;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId(1L);
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setEmail("john.doe@example.com");

    testTalent = new User();
    testTalent.setId(2L);
    testTalent.setFirstName("Jane");
    testTalent.setLastName("Smith");
    testTalent.setEmail("jane.smith@example.com");

    startTime = LocalDateTime.now().plusDays(1);
    endTime = startTime.plusHours(2);

    testBooking = new Booking();
    testBooking.setId(1L);
    testBooking.setUser(testUser);
    testBooking.setTalent(testTalent);
    testBooking.setServiceDescription("Web Development Consultation");
    testBooking.setBookingDate(LocalDateTime.now());
    testBooking.setStartTime(startTime);
    testBooking.setEndTime(endTime);
    testBooking.setAmount(new BigDecimal("100.00"));
    testBooking.setNotes("Initial consultation");
    testBooking.setStatus(BookingStatus.PENDING);
  }

  @Test
  void createBooking_ShouldCreateBookingSuccessfully() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(userRepository.findById(2L)).thenReturn(Optional.of(testTalent));
    when(bookingRepository.findConflictingBookings(
            eq(testTalent), any(LocalDateTime.class), any(LocalDateTime.class)))
        .thenReturn(Collections.emptyList());
    when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
    when(notificationService.createNotification(
            eq(testTalent), anyString(), anyString(), eq(NotificationType.BOOKING_CONFIRMED)))
        .thenReturn(new Notification());

    // Act
    Booking result =
        bookingService.createBooking(
            1L,
            2L,
            "Web Development Consultation",
            startTime,
            endTime,
            new BigDecimal("100.00"),
            "Initial consultation");

    // Assert
    assertNotNull(result);
    assertEquals(testUser, result.getUser());
    assertEquals(testTalent, result.getTalent());
    assertEquals("Web Development Consultation", result.getServiceDescription());
    assertEquals(BookingStatus.PENDING, result.getStatus());

    verify(userRepository).findById(1L);
    verify(userRepository).findById(2L);
    verify(bookingRepository)
        .findConflictingBookings(
            eq(testTalent), any(LocalDateTime.class), any(LocalDateTime.class));
    verify(bookingRepository).save(any(Booking.class));
    verify(notificationService)
        .createNotification(
            eq(testTalent), anyString(), anyString(), eq(NotificationType.BOOKING_CONFIRMED));
  }

  @Test
  void createBooking_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        RuntimeException.class,
        () ->
            bookingService.createBooking(
                1L, 2L, "Service", startTime, endTime, new BigDecimal("100.00"), "Notes"));

    verify(userRepository).findById(1L);
    verify(bookingRepository, never()).save(any(Booking.class));
  }

  @Test
  void createBooking_ShouldThrowException_WhenTalentNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(userRepository.findById(2L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        RuntimeException.class,
        () ->
            bookingService.createBooking(
                1L, 2L, "Service", startTime, endTime, new BigDecimal("100.00"), "Notes"));

    verify(userRepository).findById(1L);
    verify(userRepository).findById(2L);
    verify(bookingRepository, never()).save(any(Booking.class));
  }

  @Test
  void createBooking_ShouldThrowException_WhenTimeSlotConflicts() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(userRepository.findById(2L)).thenReturn(Optional.of(testTalent));
    when(bookingRepository.findConflictingBookings(
            eq(testTalent), any(LocalDateTime.class), any(LocalDateTime.class)))
        .thenReturn(Arrays.asList(testBooking));

    // Act & Assert
    assertThrows(
        RuntimeException.class,
        () ->
            bookingService.createBooking(
                1L, 2L, "Service", startTime, endTime, new BigDecimal("100.00"), "Notes"));

    verify(userRepository).findById(1L);
    verify(userRepository).findById(2L);
    verify(bookingRepository)
        .findConflictingBookings(
            eq(testTalent), any(LocalDateTime.class), any(LocalDateTime.class));
    verify(bookingRepository, never()).save(any(Booking.class));
  }

  @Test
  void confirmBooking_ShouldUpdateBookingToConfirmed() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
    when(paymentService.confirmPayment(anyString())).thenReturn(true);
    when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

    // Act
    Booking result = bookingService.confirmBooking(1L, "payment_intent_123");

    // Assert
    assertNotNull(result);
    assertEquals(BookingStatus.CONFIRMED, result.getStatus());
    assertEquals("payment_intent_123", result.getPaymentIntentId());

    verify(bookingRepository).findById(1L);
    verify(paymentService).confirmPayment("payment_intent_123");
    verify(bookingRepository).save(testBooking);
  }

  @Test
  void confirmBooking_ShouldThrowException_WhenBookingNotFound() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        RuntimeException.class, () -> bookingService.confirmBooking(1L, "payment_intent_123"));

    verify(bookingRepository).findById(1L);
    verify(paymentService, never()).confirmPayment(anyString());
  }

  @Test
  void confirmBooking_ShouldThrowException_WhenPaymentFails() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
    when(paymentService.confirmPayment(anyString())).thenReturn(false);

    // Act & Assert
    assertThrows(
        RuntimeException.class, () -> bookingService.confirmBooking(1L, "payment_intent_123"));

    verify(bookingRepository).findById(1L);
    verify(paymentService).confirmPayment("payment_intent_123");
    verify(bookingRepository, never()).save(any(Booking.class));
  }

  @Test
  void updateBookingStatus_ShouldUpdateStatusSuccessfully() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
    when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

    // Act
    Booking result = bookingService.updateBookingStatus(1L, BookingStatus.COMPLETED);

    // Assert
    assertNotNull(result);
    assertEquals(BookingStatus.COMPLETED, result.getStatus());

    verify(bookingRepository).findById(1L);
    verify(bookingRepository).save(testBooking);
  }

  @Test
  void updateBookingStatus_ShouldThrowException_WhenBookingNotFound() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        RuntimeException.class,
        () -> bookingService.updateBookingStatus(1L, BookingStatus.COMPLETED));

    verify(bookingRepository).findById(1L);
    verify(bookingRepository, never()).save(any(Booking.class));
  }

  @Test
  void getUserBookings_ShouldReturnUserBookings() {
    // Arrange
    List<Booking> bookings = Arrays.asList(testBooking);
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(bookingRepository.findByUser(testUser)).thenReturn(bookings);

    // Act
    List<Booking> result = bookingService.getUserBookings(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testBooking, result.get(0));

    verify(userRepository).findById(1L);
    verify(bookingRepository).findByUser(testUser);
  }

  @Test
  void getTalentBookings_ShouldReturnTalentBookings() {
    // Arrange
    List<Booking> bookings = Arrays.asList(testBooking);
    when(userRepository.findById(2L)).thenReturn(Optional.of(testTalent));
    when(bookingRepository.findByTalent(testTalent)).thenReturn(bookings);

    // Act
    List<Booking> result = bookingService.getTalentBookings(2L);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testBooking, result.get(0));

    verify(userRepository).findById(2L);
    verify(bookingRepository).findByTalent(testTalent);
  }

  @Test
  void getBookingById_ShouldReturnBooking() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

    // Act
    Booking result = bookingService.getBookingById(1L);

    // Assert
    assertNotNull(result);
    assertEquals(testBooking, result);

    verify(bookingRepository).findById(1L);
  }

  @Test
  void getBookingById_ShouldThrowException_WhenBookingNotFound() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> bookingService.getBookingById(1L));

    verify(bookingRepository).findById(1L);
  }

  @Test
  void cancelBooking_ShouldCancelBookingSuccessfully() {
    // Arrange
    testBooking.setStatus(BookingStatus.CONFIRMED);
    testBooking.setStartTime(LocalDateTime.now().plusHours(25)); // More than 24 hours away
    testBooking.setPaymentIntentId("payment_intent_123"); // Set payment intent ID
    when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
    when(paymentService.refundPayment(anyString())).thenReturn(true);
    when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

    // Act
    bookingService.cancelBooking(1L);

    // Assert
    verify(bookingRepository).findById(1L);
    verify(paymentService).refundPayment(testBooking.getPaymentIntentId());
    verify(bookingRepository).save(testBooking);
    assertEquals(BookingStatus.REFUNDED, testBooking.getStatus());
  }

  @Test
  void cancelBooking_ShouldThrowException_WhenBookingNotFound() {
    // Arrange
    when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> bookingService.cancelBooking(1L));

    verify(bookingRepository).findById(1L);
    verify(paymentService, never()).refundPayment(anyString());
  }
}
