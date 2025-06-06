package com.shopexperts.payload;

import java.util.Set;

public class UserSummary {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private String profileImageUrl;
  private Set<String> roles;

  public UserSummary(
      Long id,
      String firstName,
      String lastName,
      String email,
      String profileImageUrl,
      Set<String> roles) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profileImageUrl = profileImageUrl;
    this.roles = roles;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }

  public void setProfileImageUrl(String profileImageUrl) {
    this.profileImageUrl = profileImageUrl;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  // Convenience method to get full name
  public String getName() {
    return this.firstName + " " + this.lastName;
  }
}
