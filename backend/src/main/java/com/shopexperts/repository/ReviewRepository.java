package com.shopexperts.repository;

import com.shopexperts.model.Review;
import com.shopexperts.model.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
  List<Review> findByTalent(User talent);

  List<Review> findByReviewer(User reviewer);

  List<Review> findByTalentAndApproved(User talent, Boolean approved);

  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.talent = :talent AND r.approved = true")
  Double getAverageRatingByTalent(@Param("talent") User talent);

  @Query("SELECT COUNT(r) FROM Review r WHERE r.talent = :talent AND r.approved = true")
  Long countReviewsByTalent(@Param("talent") User talent);

  List<Review> findByApproved(Boolean approved);

  // Additional methods for talent ID-based queries
  Page<Review> findByTalentIdOrderByCreatedAtDesc(Long talentId, Pageable pageable);

  Page<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId, Pageable pageable);

  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.talent.id = :talentId AND r.approved = true")
  Double findAverageRatingByTalentId(@Param("talentId") Long talentId);

  Long countByTalentId(Long talentId);

  List<Review> findTop10ByOrderByCreatedAtDesc();

  boolean existsByReviewerIdAndTalentId(Long reviewerId, Long talentId);
}
