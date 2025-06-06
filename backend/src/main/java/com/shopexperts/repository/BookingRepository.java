package com.shopexperts.repository;

import com.shopexperts.model.Booking;
import com.shopexperts.model.BookingStatus;
import com.shopexperts.model.User;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findByUser(User user);

  List<Booking> findByTalent(User talent);

  List<Booking> findByUserAndStatus(User user, BookingStatus status);

  List<Booking> findByTalentAndStatus(User talent, BookingStatus status);

  @Query(
      "SELECT b FROM Booking b WHERE b.talent = :talent AND "
          + "b.startTime <= :endTime AND b.endTime >= :startTime AND "
          + "b.status IN ('CONFIRMED', 'IN_PROGRESS')")
  List<Booking> findConflictingBookings(
      @Param("talent") User talent,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime);

  @Query("SELECT COUNT(b) FROM Booking b WHERE b.talent = :talent AND b.status = 'COMPLETED'")
  Long countCompletedBookingsByTalent(@Param("talent") User talent);

  @Query("SELECT COUNT(b) FROM Booking b WHERE b.user = :user AND b.status = 'COMPLETED'")
  Long countCompletedBookingsByUser(@Param("user") User user);
}
