package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.shopexperts.model.*;
import com.shopexperts.payload.UserSummary;
import com.shopexperts.payload.request.SignupRequest;
import com.shopexperts.repository.RoleRepository;
import com.shopexperts.repository.UserRepository;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock private UserRepository userRepository;

  @Mock private RoleRepository roleRepository;

  @Mock private PasswordEncoder passwordEncoder;

  @Mock private RewardService rewardService;

  @InjectMocks private UserService userService;

  private User testUser;
  private Role userRole;
  private SignupRequest signupRequest;

  @BeforeEach
  void setUp() {
    userRole = new Role();
    userRole.setId(1L);
    userRole.setName(RoleName.ROLE_USER);

    testUser = new User();
    testUser.setId(1L);
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setEmail("john.doe@example.com");
    testUser.setPassword("encodedPassword");
    testUser.setProvider(AuthProvider.LOCAL);
    testUser.setRoles(Collections.singleton(userRole));

    UserProfile profile = new UserProfile();
    profile.setUserType(UserType.INDIVIDUAL);
    testUser.setProfile(profile);

    signupRequest = new SignupRequest();
    signupRequest.setFirstName("John");
    signupRequest.setLastName("Doe");
    signupRequest.setEmail("john.doe@example.com");
    signupRequest.setPassword("password123");
    signupRequest.setUserType("INDIVIDUAL");
  }

  @Test
  void createUser_ShouldCreateUserSuccessfully() {
    // Arrange
    RewardAccount rewardAccount = new RewardAccount();
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
    when(userRepository.save(any(User.class))).thenReturn(testUser);
    when(rewardService.createRewardAccount(any(User.class))).thenReturn(rewardAccount);

    // Act
    User result = userService.createUser(signupRequest);

    // Assert
    assertNotNull(result);
    assertEquals("John", result.getFirstName());
    assertEquals("Doe", result.getLastName());
    assertEquals("john.doe@example.com", result.getEmail());
    assertEquals("encodedPassword", result.getPassword());
    assertEquals(AuthProvider.LOCAL, result.getProvider());
    assertTrue(result.getRoles().contains(userRole));

    verify(passwordEncoder).encode("password123");
    verify(roleRepository).findByName(RoleName.ROLE_USER);
    verify(userRepository, times(2)).save(any(User.class));
    verify(rewardService).createRewardAccount(any(User.class));
  }

  @Test
  void createUser_ShouldThrowException_WhenRoleNotFound() {
    // Arrange
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> userService.createUser(signupRequest));

    verify(passwordEncoder).encode("password123");
    verify(roleRepository).findByName(RoleName.ROLE_USER);
    verify(userRepository, never()).save(any(User.class));
    verify(rewardService, never()).createRewardAccount(any(User.class));
  }

  @Test
  void findByEmail_ShouldReturnUser_WhenUserExists() {
    // Arrange
    when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));

    // Act
    Optional<User> result = userService.findByEmail("john.doe@example.com");

    // Assert
    assertTrue(result.isPresent());
    assertEquals(testUser, result.get());
    verify(userRepository).findByEmail("john.doe@example.com");
  }

  @Test
  void findByEmail_ShouldReturnEmpty_WhenUserDoesNotExist() {
    // Arrange
    when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

    // Act
    Optional<User> result = userService.findByEmail("nonexistent@example.com");

    // Assert
    assertFalse(result.isPresent());
    verify(userRepository).findByEmail("nonexistent@example.com");
  }

  @Test
  void findById_ShouldReturnUser_WhenUserExists() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    // Act
    Optional<User> result = userService.findById(1L);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(testUser, result.get());
    verify(userRepository).findById(1L);
  }

  @Test
  void existsByEmail_ShouldReturnTrue_WhenUserExists() {
    // Arrange
    when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(true);

    // Act
    Boolean result = userService.existsByEmail("john.doe@example.com");

    // Assert
    assertTrue(result);
    verify(userRepository).existsByEmail("john.doe@example.com");
  }

  @Test
  void existsByEmail_ShouldReturnFalse_WhenUserDoesNotExist() {
    // Arrange
    when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

    // Act
    Boolean result = userService.existsByEmail("nonexistent@example.com");

    // Assert
    assertFalse(result);
    verify(userRepository).existsByEmail("nonexistent@example.com");
  }

  @Test
  void getCurrentUser_ShouldReturnUserSummary_WhenUserExists() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    // Act
    UserSummary result = userService.getCurrentUser(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("John Doe", result.getName());
    assertEquals("john.doe@example.com", result.getEmail());
    verify(userRepository).findById(1L);
  }

  @Test
  void getCurrentUser_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> userService.getCurrentUser(1L));
    verify(userRepository).findById(1L);
  }

  @Test
  void updateUser_ShouldUpdateUserSuccessfully() {
    // Arrange
    User updatedDetails = new User();
    updatedDetails.setFirstName("Jane");
    updatedDetails.setLastName("Smith");

    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    // Act
    User result = userService.updateUser(1L, updatedDetails);

    // Assert
    assertNotNull(result);
    verify(userRepository).findById(1L);
    verify(userRepository).save(testUser);
  }

  @Test
  void updateUser_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    User updatedDetails = new User();
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> userService.updateUser(1L, updatedDetails));
    verify(userRepository).findById(1L);
    verify(userRepository, never()).save(any(User.class));
  }

  @Test
  void getAllTalents_ShouldReturnTalentsList() {
    // Arrange
    List<User> talents = Arrays.asList(testUser);
    when(userRepository.findAllTalents()).thenReturn(talents);

    // Act
    List<User> result = userService.getAllTalents();

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testUser, result.get(0));
    verify(userRepository).findAllTalents();
  }

  @Test
  void searchTalents_ShouldReturnFilteredTalents() {
    // Arrange
    List<User> talents = Arrays.asList(testUser);
    when(userRepository.searchTalents(anyString(), anyString(), anyString())).thenReturn(talents);

    // Act
    List<User> result = userService.searchTalents("New York", "Programming", "Java");

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testUser, result.get(0));
    verify(userRepository).searchTalents("New York", "Programming", "Java");
  }

  @Test
  void findTalentsNearLocation_ShouldReturnNearbyTalents() {
    // Arrange
    List<User> talents = Arrays.asList(testUser);
    // The actual method expects 4 parameters: minLat, maxLat, minLng, maxLng
    when(userRepository.findTalentsNearLocation(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
        .thenReturn(talents);

    // Act
    List<User> result = userService.findTalentsNearLocation(40.7128, -74.0060, 10.0);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(testUser, result.get(0));
    verify(userRepository)
        .findTalentsNearLocation(anyDouble(), anyDouble(), anyDouble(), anyDouble());
  }
}
