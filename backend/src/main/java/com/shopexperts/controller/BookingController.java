package com.shopexperts.controller;

import com.shopexperts.model.Booking;
import com.shopexperts.model.BookingStatus;
import com.shopexperts.payload.ApiResponse;
import com.shopexperts.security.JwtTokenProvider;
import com.shopexperts.service.BookingService;
import com.shopexperts.service.PaymentService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

  @Autowired private BookingService bookingService;

  @Autowired private PaymentService paymentService;

  @Autowired private JwtTokenProvider tokenProvider;

  @PostMapping
  public ResponseEntity<?> createBooking(
      @RequestHeader("Authorization") String token,
      @RequestBody Map<String, Object> bookingRequest) {
    try {
      String jwt = token.substring(7);
      Long userId = tokenProvider.getUserIdFromJWT(jwt);

      Long talentId = Long.valueOf(bookingRequest.get("talentId").toString());
      String serviceDescription = bookingRequest.get("serviceDescription").toString();
      LocalDateTime startTime = LocalDateTime.parse(bookingRequest.get("startTime").toString());
      LocalDateTime endTime = LocalDateTime.parse(bookingRequest.get("endTime").toString());
      BigDecimal amount = new BigDecimal(bookingRequest.get("amount").toString());
      String notes =
          bookingRequest.get("notes") != null ? bookingRequest.get("notes").toString() : "";

      Booking booking =
          bookingService.createBooking(
              userId, talentId, serviceDescription, startTime, endTime, amount, notes);

      return ResponseEntity.ok(booking);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Booking creation failed: " + e.getMessage()));
    }
  }

  @PostMapping("/{bookingId}/confirm")
  public ResponseEntity<?> confirmBooking(
      @PathVariable Long bookingId, @RequestBody Map<String, Object> paymentRequest) {
    try {
      BigDecimal amount = new BigDecimal(paymentRequest.get("amount").toString());
      String currency = paymentRequest.get("currency").toString();

      // Create payment intent
      String paymentIntentId =
          paymentService.createPaymentIntent(amount, currency, "Booking payment");

      // Confirm booking
      Booking booking = bookingService.confirmBooking(bookingId, paymentIntentId);

      return ResponseEntity.ok(booking);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Booking confirmation failed: " + e.getMessage()));
    }
  }

  @GetMapping("/my-bookings")
  public ResponseEntity<?> getMyBookings(@RequestHeader("Authorization") String token) {
    try {
      String jwt = token.substring(7);
      Long userId = tokenProvider.getUserIdFromJWT(jwt);

      List<Booking> bookings = bookingService.getUserBookings(userId);
      return ResponseEntity.ok(bookings);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Failed to fetch bookings: " + e.getMessage()));
    }
  }

  @GetMapping("/talent-bookings")
  public ResponseEntity<?> getTalentBookings(@RequestHeader("Authorization") String token) {
    try {
      String jwt = token.substring(7);
      Long userId = tokenProvider.getUserIdFromJWT(jwt);

      List<Booking> bookings = bookingService.getTalentBookings(userId);
      return ResponseEntity.ok(bookings);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Failed to fetch talent bookings: " + e.getMessage()));
    }
  }

  @GetMapping("/{bookingId}")
  public ResponseEntity<?> getBooking(@PathVariable Long bookingId) {
    try {
      Booking booking = bookingService.getBookingById(bookingId);
      return ResponseEntity.ok(booking);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Booking not found: " + e.getMessage()));
    }
  }

  @PutMapping("/{bookingId}/status")
  public ResponseEntity<?> updateBookingStatus(
      @PathVariable Long bookingId, @RequestBody Map<String, String> statusRequest) {
    try {
      BookingStatus status = BookingStatus.valueOf(statusRequest.get("status"));
      Booking booking = bookingService.updateBookingStatus(bookingId, status);
      return ResponseEntity.ok(booking);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Status update failed: " + e.getMessage()));
    }
  }

  @DeleteMapping("/{bookingId}")
  public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
    try {
      bookingService.cancelBooking(bookingId);
      return ResponseEntity.ok(new ApiResponse(true, "Booking cancelled successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Cancellation failed: " + e.getMessage()));
    }
  }
}
