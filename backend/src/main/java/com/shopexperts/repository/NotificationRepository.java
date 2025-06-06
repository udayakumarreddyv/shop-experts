package com.shopexperts.repository;

import com.shopexperts.model.Notification;
import com.shopexperts.model.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByUserOrderByCreatedAtDesc(User user);

  List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, Boolean isRead);

  Long countByUserAndIsRead(User user, Boolean isRead);

  // New methods for user ID-based queries
  Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  Long countByUserIdAndIsRead(Long userId, Boolean isRead);

  List<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead);
}
