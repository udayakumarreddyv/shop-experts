package com.shopexperts.payload;

import com.shopexperts.model.Role;
import java.time.LocalDateTime;
import java.util.Set;

public class UserResponse {
  private Long id;
  private String name;
  private String username;
  private String email;
  private String phoneNumber;
  private String profilePictureUrl;
  private Set<Role> roles;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private boolean emailVerified;
  private boolean accountEnabled;

  // Constructors
  public UserResponse() {}

  public UserResponse(
      Long id,
      String name,
      String username,
      String email,
      String phoneNumber,
      String profilePictureUrl,
      Set<Role> roles,
      LocalDateTime createdAt,
      LocalDateTime updatedAt,
      boolean emailVerified,
      boolean accountEnabled) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.profilePictureUrl = profilePictureUrl;
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.emailVerified = emailVerified;
    this.accountEnabled = accountEnabled;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getProfilePictureUrl() {
    return profilePictureUrl;
  }

  public void setProfilePictureUrl(String profilePictureUrl) {
    this.profilePictureUrl = profilePictureUrl;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public boolean isAccountEnabled() {
    return accountEnabled;
  }

  public void setAccountEnabled(boolean accountEnabled) {
    this.accountEnabled = accountEnabled;
  }
}
