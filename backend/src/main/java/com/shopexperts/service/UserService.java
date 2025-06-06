package com.shopexperts.service;

import com.shopexperts.model.*;
import com.shopexperts.payload.UserSummary;
import com.shopexperts.payload.request.SignupRequest;
import com.shopexperts.repository.RoleRepository;
import com.shopexperts.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired private UserRepository userRepository;

  @Autowired private RoleRepository roleRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  @Autowired private RewardService rewardService;

  public User createUser(SignupRequest signUpRequest) {
    User user = new User();
    user.setFirstName(signUpRequest.getFirstName());
    user.setLastName(signUpRequest.getLastName());
    user.setEmail(signUpRequest.getEmail());
    user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
    user.setProvider(AuthProvider.LOCAL);

    Role userRole =
        roleRepository
            .findByName(RoleName.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("User Role not set."));

    user.setRoles(Collections.singleton(userRole));

    User savedUser = userRepository.save(user);

    // Create user profile
    UserProfile profile = new UserProfile();
    profile.setUser(savedUser);
    if (signUpRequest.getUserType() != null) {
      profile.setUserType(UserType.valueOf(signUpRequest.getUserType()));
    } else {
      profile.setUserType(UserType.INDIVIDUAL);
    }
    savedUser.setProfile(profile);

    // Create reward account
    rewardService.createRewardAccount(savedUser);

    return userRepository.save(savedUser);
  }

  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  public Boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  public List<User> searchTalents(String location, String category, String skills) {
    return userRepository.searchTalents(location, category, skills);
  }

  public List<User> findTalentsNearLocation(Double latitude, Double longitude, Double radiusKm) {
    // Calculate bounding box for location search
    Double lat = Math.toRadians(latitude);
    Double radius = radiusKm / 111.0; // Approximate km to degree conversion

    Double minLat = latitude - radius;
    Double maxLat = latitude + radius;
    Double minLng = longitude - radius / Math.cos(lat);
    Double maxLng = longitude + radius / Math.cos(lat);

    return userRepository.findTalentsNearLocation(minLat, maxLat, minLng, maxLng);
  }

  public UserSummary getCurrentUser(Long userId) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    Set<String> roles =
        user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet());

    return new UserSummary(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getProfileImageUrl(),
        roles);
  }

  public User updateUser(Long userId, User userDetails) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    user.setFirstName(userDetails.getFirstName());
    user.setLastName(userDetails.getLastName());
    user.setPhone(userDetails.getPhone());
    user.setProfileImageUrl(userDetails.getProfileImageUrl());

    return userRepository.save(user);
  }

  public List<User> getAllTalents() {
    return userRepository.findAllTalents();
  }
}
