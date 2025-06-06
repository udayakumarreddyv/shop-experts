package com.shopexperts.service;

import com.shopexperts.model.*;
import com.shopexperts.repository.BookingRepository;
import com.shopexperts.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

  @Autowired private BookingRepository bookingRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private PaymentService paymentService;

  @Autowired private NotificationService notificationService;

  @Autowired private RewardService rewardService;

  public Booking createBooking(
      Long userId,
      Long talentId,
      String serviceDescription,
      LocalDateTime startTime,
      LocalDateTime endTime,
      BigDecimal amount,
      String notes) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    User talent =
        userRepository
            .findById(talentId)
            .orElseThrow(() -> new RuntimeException("Talent not found"));

    // Check for conflicts
    List<Booking> conflicts = bookingRepository.findConflictingBookings(talent, startTime, endTime);
    if (!conflicts.isEmpty()) {
      throw new RuntimeException("Time slot is already booked");
    }

    Booking booking = new Booking();
    booking.setUser(user);
    booking.setTalent(talent);
    booking.setServiceDescription(serviceDescription);
    booking.setBookingDate(LocalDateTime.now());
    booking.setStartTime(startTime);
    booking.setEndTime(endTime);
    booking.setAmount(amount);
    booking.setNotes(notes);
    booking.setStatus(BookingStatus.PENDING);

    Booking savedBooking = bookingRepository.save(booking);

    // Send notification to talent
    notificationService.createNotification(
        talent,
        "New Booking Request",
        "You have a new booking request from " + user.getFirstName() + " " + user.getLastName(),
        NotificationType.BOOKING_CONFIRMED);

    return savedBooking;
  }

  public Booking confirmBooking(Long bookingId, String paymentIntentId) {
    Booking booking =
        bookingRepository
            .findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    // Confirm payment first
    boolean paymentConfirmed = paymentService.confirmPayment(paymentIntentId);
    if (!paymentConfirmed) {
      throw new RuntimeException("Payment confirmation failed");
    }

    booking.setStatus(BookingStatus.CONFIRMED);
    booking.setPaymentIntentId(paymentIntentId);

    Booking savedBooking = bookingRepository.save(booking);

    // Send confirmation notifications
    notificationService.createNotification(
        booking.getUser(),
        "Booking Confirmed",
        "Your booking has been confirmed",
        NotificationType.BOOKING_CONFIRMED);

    notificationService.createNotification(
        booking.getTalent(),
        "Booking Confirmed",
        "A booking has been confirmed",
        NotificationType.BOOKING_CONFIRMED);

    // Award points for booking
    rewardService.awardPoints(booking.getUser(), 10, "Booking completed");

    return savedBooking;
  }

  public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
    Booking booking =
        bookingRepository
            .findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    booking.setStatus(status);
    return bookingRepository.save(booking);
  }

  public List<Booking> getUserBookings(Long userId) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    return bookingRepository.findByUser(user);
  }

  public List<Booking> getTalentBookings(Long talentId) {
    User talent =
        userRepository
            .findById(talentId)
            .orElseThrow(() -> new RuntimeException("Talent not found"));

    return bookingRepository.findByTalent(talent);
  }

  public Booking getBookingById(Long bookingId) {
    return bookingRepository
        .findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
  }

  public void cancelBooking(Long bookingId) {
    Booking booking =
        bookingRepository
            .findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.PENDING
        && booking.getStatus() != BookingStatus.CONFIRMED) {
      throw new RuntimeException("Cannot cancel booking in current status");
    }

    // Process refund if payment was made
    if (booking.getPaymentIntentId() != null) {
      paymentService.refundPayment(booking.getPaymentIntentId());
      booking.setStatus(BookingStatus.REFUNDED);
    } else {
      booking.setStatus(BookingStatus.CANCELLED);
    }

    bookingRepository.save(booking);

    // Send cancellation notifications
    notificationService.createNotification(
        booking.getUser(),
        "Booking Cancelled",
        "Your booking has been cancelled",
        NotificationType.BOOKING_CANCELLED);

    notificationService.createNotification(
        booking.getTalent(),
        "Booking Cancelled",
        "A booking has been cancelled",
        NotificationType.BOOKING_CANCELLED);
  }
}
