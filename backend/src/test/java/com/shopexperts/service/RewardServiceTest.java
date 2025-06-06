package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.shopexperts.model.*;
import com.shopexperts.payload.RewardAccountResponse;
import com.shopexperts.payload.RewardTransactionResponse;
import com.shopexperts.repository.RewardAccountRepository;
import com.shopexperts.repository.RewardTransactionRepository;
import com.shopexperts.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class RewardServiceTest {

  @Mock private RewardAccountRepository rewardAccountRepository;

  @Mock private RewardTransactionRepository rewardTransactionRepository;

  @Mock private UserRepository userRepository;

  @Mock private NotificationService notificationService;

  @InjectMocks private RewardService rewardService;

  private User testUser;
  private RewardAccount testRewardAccount;
  private RewardTransaction testTransaction;
  private Pageable pageable;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId(1L);
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setEmail("john.doe@example.com");

    testRewardAccount = new RewardAccount();
    testRewardAccount.setId(1L);
    testRewardAccount.setUser(testUser);
    testRewardAccount.setTotalPoints(100);
    testRewardAccount.setAvailablePoints(80);
    testRewardAccount.setRedeemedPoints(20);
    testRewardAccount.setCreatedAt(LocalDateTime.now());
    testRewardAccount.setUpdatedAt(LocalDateTime.now());

    testTransaction = new RewardTransaction();
    testTransaction.setId(1L);
    testTransaction.setRewardAccount(testRewardAccount);
    testTransaction.setType(TransactionType.EARNED);
    testTransaction.setPoints(50);
    testTransaction.setDescription("Booking completion bonus");
    testTransaction.setCreatedAt(LocalDateTime.now());

    pageable = PageRequest.of(0, 10);
  }

  @Test
  void createRewardAccount_ShouldCreateAccountSuccessfully() {
    // Arrange
    RewardAccount newAccount = new RewardAccount();
    newAccount.setUser(testUser);
    newAccount.setTotalPoints(0);
    newAccount.setAvailablePoints(0);
    newAccount.setRedeemedPoints(0);

    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(newAccount);

    // Act
    RewardAccount result = rewardService.createRewardAccount(testUser);

    // Assert
    assertNotNull(result);
    assertEquals(testUser, result.getUser());
    assertEquals(0, result.getTotalPoints());
    assertEquals(0, result.getAvailablePoints());
    assertEquals(0, result.getRedeemedPoints());

    verify(rewardAccountRepository).save(any(RewardAccount.class));
  }

  @Test
  void getRewardAccountEntity_ShouldReturnRewardAccount() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));

    // Act
    RewardAccount result = rewardService.getRewardAccountEntity(1L);

    // Assert
    assertNotNull(result);
    assertEquals(testRewardAccount, result);

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
  }

  @Test
  void getRewardAccountEntity_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> rewardService.getRewardAccountEntity(1L));

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository, never()).findByUser(any(User.class));
  }

  @Test
  void getRewardAccountEntity_ShouldThrowException_WhenAccountNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> rewardService.getRewardAccountEntity(1L));

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
  }

  @Test
  void getRewardAccount_ShouldReturnRewardAccountResponse() {
    // Arrange
    List<RewardTransaction> transactions =
        Arrays.asList(
            createTestTransactionWithDescription("Referral bonus for inviting John"),
            createTestTransactionWithDescription("Booking completion bonus"));
    Page<RewardTransaction> transactionPage = new PageImpl<>(transactions);

    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardTransactionRepository.findByRewardAccountOrderByCreatedAtDesc(
            testRewardAccount, Pageable.unpaged()))
        .thenReturn(transactionPage);

    // Act
    RewardAccountResponse result = rewardService.getRewardAccount(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals(1L, result.getUserId());
    assertEquals("John Doe", result.getUserName());
    assertEquals(new BigDecimal("100"), result.getTotalPoints());
    assertEquals(new BigDecimal("80"), result.getAvailablePoints());
    assertEquals(new BigDecimal("20"), result.getUsedPoints());

    verify(userRepository, times(2))
        .findById(1L); // Called twice: once for getRewardAccountEntity, once for countUserReferrals
    verify(rewardAccountRepository, times(2))
        .findByUser(
            testUser); // Called twice: once for getRewardAccountEntity, once for countUserReferrals
  }

  @Test
  void awardPoints_ShouldAwardPointsSuccessfully() {
    // Arrange
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(testRewardAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);
    when(notificationService.createNotification(
            eq(testUser), anyString(), anyString(), eq(NotificationType.REFERRAL_BONUS)))
        .thenReturn(new Notification());

    // Act
    rewardService.awardPoints(testUser, 50, "Booking completion bonus");

    // Assert
    assertEquals(150, testRewardAccount.getTotalPoints()); // 100 + 50
    assertEquals(130, testRewardAccount.getAvailablePoints()); // 80 + 50

    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository).save(testRewardAccount);
    verify(rewardTransactionRepository).save(any(RewardTransaction.class));
    verify(notificationService)
        .createNotification(
            eq(testUser), anyString(), anyString(), eq(NotificationType.REFERRAL_BONUS));
  }

  @Test
  void awardPoints_ShouldThrowException_WhenAccountNotFound() {
    // Arrange
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> rewardService.awardPoints(testUser, 50, "Bonus"));

    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository, never()).save(any(RewardAccount.class));
  }

  @Test
  void redeemPoints_ShouldRedeemPointsSuccessfully() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(testRewardAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);

    // Act
    boolean result = rewardService.redeemPoints(1L, 50, "Store credit");

    // Assert
    assertTrue(result);
    assertEquals(30, testRewardAccount.getAvailablePoints()); // 80 - 50
    assertEquals(70, testRewardAccount.getRedeemedPoints()); // 20 + 50

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository).save(testRewardAccount);
    verify(rewardTransactionRepository).save(any(RewardTransaction.class));
  }

  @Test
  void redeemPoints_ShouldReturnFalse_WhenInsufficientPoints() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));

    // Act
    boolean result =
        rewardService.redeemPoints(
            1L, 100, "Store credit"); // Trying to redeem 100 but only 80 available

    // Assert
    assertFalse(result);
    assertEquals(80, testRewardAccount.getAvailablePoints()); // Unchanged
    assertEquals(20, testRewardAccount.getRedeemedPoints()); // Unchanged

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository, never()).save(any(RewardAccount.class));
    verify(rewardTransactionRepository, never()).save(any(RewardTransaction.class));
  }

  @Test
  void redeemPoints_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> rewardService.redeemPoints(1L, 50, "Store credit"));

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository, never()).findByUser(any(User.class));
  }

  @Test
  void getRewardTransactions_ShouldReturnPagedTransactions() {
    // Arrange
    List<RewardTransaction> transactions = Arrays.asList(testTransaction);
    Page<RewardTransaction> transactionPage = new PageImpl<>(transactions, pageable, 1);

    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardTransactionRepository.findByRewardAccountOrderByCreatedAtDesc(
            testRewardAccount, pageable))
        .thenReturn(transactionPage);

    // Act
    Page<RewardTransactionResponse> result = rewardService.getRewardTransactions(1L, pageable);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());
    assertEquals(1, result.getContent().size());

    RewardTransactionResponse response = result.getContent().get(0);
    assertEquals(1L, response.getId());
    assertEquals(TransactionType.EARNED, response.getType());
    assertEquals(new BigDecimal("50"), response.getAmount());
    assertEquals("Booking completion bonus", response.getDescription());

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardTransactionRepository)
        .findByRewardAccountOrderByCreatedAtDesc(testRewardAccount, pageable);
  }

  @Test
  void awardReferralBonus_ShouldAwardBonusesToBothUsers() {
    // Arrange
    User referrer = new User();
    referrer.setId(1L);
    referrer.setFirstName("John");
    referrer.setLastName("Doe");

    User referred = new User();
    referred.setId(2L);
    referred.setFirstName("Jane");
    referred.setLastName("Smith");

    RewardAccount referrerAccount = new RewardAccount();
    referrerAccount.setUser(referrer);
    referrerAccount.setTotalPoints(100);
    referrerAccount.setAvailablePoints(100);

    RewardAccount referredAccount = new RewardAccount();
    referredAccount.setUser(referred);
    referredAccount.setTotalPoints(0);
    referredAccount.setAvailablePoints(0);

    when(rewardAccountRepository.findByUser(referrer)).thenReturn(Optional.of(referrerAccount));
    when(rewardAccountRepository.findByUser(referred)).thenReturn(Optional.of(referredAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(referrerAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);
    when(notificationService.createNotification(
            any(User.class), anyString(), anyString(), any(NotificationType.class)))
        .thenReturn(new Notification());

    // Act
    rewardService.awardReferralBonus(referrer, referred);

    // Assert
    verify(rewardAccountRepository, times(2)).findByUser(any(User.class));
    verify(rewardAccountRepository, times(2)).save(any(RewardAccount.class));
    verify(rewardTransactionRepository, times(2)).save(any(RewardTransaction.class));
    verify(notificationService, times(2))
        .createNotification(any(User.class), anyString(), anyString(), any(NotificationType.class));
  }

  @Test
  void awardReviewBonus_ShouldAwardReviewPoints() {
    // Arrange
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(testRewardAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);
    when(notificationService.createNotification(
            any(User.class), anyString(), anyString(), any(NotificationType.class)))
        .thenReturn(new Notification());

    // Act
    rewardService.awardReviewBonus(testUser);

    // Assert
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository).save(testRewardAccount);
    verify(rewardTransactionRepository).save(any(RewardTransaction.class));
    verify(notificationService)
        .createNotification(any(User.class), anyString(), anyString(), any(NotificationType.class));
  }

  @Test
  void awardBookingBonus_ShouldAwardBookingPoints() {
    // Arrange
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(testRewardAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);
    when(notificationService.createNotification(
            any(User.class), anyString(), anyString(), any(NotificationType.class)))
        .thenReturn(new Notification());

    // Act
    rewardService.awardBookingBonus(testUser);

    // Assert
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository).save(testRewardAccount);
    verify(rewardTransactionRepository).save(any(RewardTransaction.class));
    verify(notificationService)
        .createNotification(any(User.class), anyString(), anyString(), any(NotificationType.class));
  }

  @Test
  void generateReferralCode_ShouldGenerateUniqueCode() {
    // Act
    String result = rewardService.generateReferralCode(1L);

    // Assert
    assertNotNull(result);
    assertTrue(result.startsWith("REF"));
    assertTrue(result.length() >= 4); // REF + at least user ID
  }

  @Test
  void redeemReferralCode_ShouldReturnTrue_WhenValidCode() {
    // Arrange
    User referrer = new User();
    referrer.setId(1L);
    referrer.setFirstName("John");
    referrer.setLastName("Doe");

    User newUser = new User();
    newUser.setId(2L);
    newUser.setFirstName("Jane");
    newUser.setLastName("Smith");

    RewardAccount referrerAccount = new RewardAccount();
    referrerAccount.setUser(referrer);
    RewardAccount newUserAccount = new RewardAccount();
    newUserAccount.setUser(newUser);

    when(userRepository.findById(1L)).thenReturn(Optional.of(referrer));
    when(userRepository.findById(2L)).thenReturn(Optional.of(newUser));
    when(rewardAccountRepository.findByUser(referrer)).thenReturn(Optional.of(referrerAccount));
    when(rewardAccountRepository.findByUser(newUser)).thenReturn(Optional.of(newUserAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(referrerAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);
    when(notificationService.createNotification(
            any(User.class), anyString(), anyString(), any(NotificationType.class)))
        .thenReturn(new Notification());

    // Generate actual referral code for user 1 and use it
    String referralCode = rewardService.generateReferralCode(1L);

    // Act
    boolean result = rewardService.redeemReferralCode(referralCode, 2L);

    // Assert
    assertTrue(result);
    verify(userRepository).findById(1L);
    verify(userRepository).findById(2L);
  }

  @Test
  void redeemReferralCode_ShouldReturnFalse_WhenInvalidCode() {
    // Act
    boolean result = rewardService.redeemReferralCode("INVALID", 2L);

    // Assert
    assertFalse(result);
  }

  @Test
  void countUserReferrals_ShouldReturnCorrectCount() {
    // Arrange
    List<RewardTransaction> transactions =
        Arrays.asList(
            createTestTransactionWithDescription("Referral bonus for inviting John"),
            createTestTransactionWithDescription("Booking completion bonus"),
            createTestTransactionWithDescription("Referral bonus for inviting Jane"));
    Page<RewardTransaction> transactionPage = new PageImpl<>(transactions);

    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardTransactionRepository.findByRewardAccountOrderByCreatedAtDesc(
            testRewardAccount, Pageable.unpaged()))
        .thenReturn(transactionPage);

    // Act
    long result = rewardService.countUserReferrals(1L);

    // Assert
    assertEquals(2L, result); // Only the referral bonuses should be counted
    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardTransactionRepository)
        .findByRewardAccountOrderByCreatedAtDesc(testRewardAccount, Pageable.unpaged());
  }

  @Test
  void redeemPointsWithTransaction_ShouldReturnTransactionResponse() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));
    when(rewardAccountRepository.save(any(RewardAccount.class))).thenReturn(testRewardAccount);
    when(rewardTransactionRepository.save(any(RewardTransaction.class)))
        .thenReturn(testTransaction);

    // Act
    RewardTransactionResponse result =
        rewardService.redeemPointsWithTransaction(1L, 50, "Store credit");

    // Assert
    assertNotNull(result);
    assertEquals(TransactionType.REDEEMED, result.getType());
    assertEquals(new BigDecimal("50"), result.getAmount());
    assertEquals("Store credit", result.getDescription());

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository).save(testRewardAccount);
    verify(rewardTransactionRepository).save(any(RewardTransaction.class));
  }

  @Test
  void redeemPointsWithTransaction_ShouldThrowException_WhenInsufficientPoints() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(rewardAccountRepository.findByUser(testUser)).thenReturn(Optional.of(testRewardAccount));

    // Act & Assert
    assertThrows(
        RuntimeException.class,
        () ->
            rewardService.redeemPointsWithTransaction(
                1L, 100, "Store credit")); // Trying to redeem more than available

    verify(userRepository).findById(1L);
    verify(rewardAccountRepository).findByUser(testUser);
    verify(rewardAccountRepository, never()).save(any(RewardAccount.class));
  }

  private RewardTransaction createTestTransactionWithDescription(String description) {
    RewardTransaction transaction = new RewardTransaction();
    transaction.setId(1L);
    transaction.setRewardAccount(testRewardAccount);
    transaction.setType(TransactionType.EARNED);
    transaction.setPoints(50);
    transaction.setDescription(description);
    transaction.setCreatedAt(LocalDateTime.now());
    return transaction;
  }
}
