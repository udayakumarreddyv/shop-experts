package com.shopexperts.repository;

import com.shopexperts.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Boolean existsByEmail(String email);

  @Query(
      "SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_TALENT' OR r.name = 'ROLE_BUSINESS'")
  List<User> findAllTalents();

  @Query(
      "SELECT u FROM User u JOIN u.profile p WHERE "
          + "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND "
          + "(:category IS NULL OR LOWER(p.businessCategory) LIKE LOWER(CONCAT('%', :category, '%'))) AND "
          + "(:skills IS NULL OR EXISTS (SELECT s FROM p.skills s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :skills, '%')))) AND "
          + "p.available = true")
  List<User> searchTalents(
      @Param("location") String location,
      @Param("category") String category,
      @Param("skills") String skills);

  @Query(
      "SELECT u FROM User u JOIN u.profile p WHERE "
          + "p.latitude BETWEEN :minLat AND :maxLat AND "
          + "p.longitude BETWEEN :minLng AND :maxLng AND "
          + "p.available = true")
  List<User> findTalentsNearLocation(
      @Param("minLat") Double minLat,
      @Param("maxLat") Double maxLat,
      @Param("minLng") Double minLng,
      @Param("maxLng") Double maxLng);
}
