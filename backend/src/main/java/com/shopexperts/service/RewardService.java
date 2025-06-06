package com.shopexperts.service;

import com.shopexperts.model.*;
import com.shopexperts.payload.RewardAccountResponse;
import com.shopexperts.payload.RewardTransactionResponse;
import com.shopexperts.repository.RewardAccountRepository;
import com.shopexperts.repository.RewardTransactionRepository;
import com.shopexperts.repository.UserRepository;
import java.security.SecureRandom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RewardService {

  @Autowired private RewardAccountRepository rewardAccountRepository;

  @Autowired private RewardTransactionRepository rewardTransactionRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private NotificationService notificationService;

  private static final String REFERRAL_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private static final int REFERRAL_CODE_LENGTH = 8;
  private final SecureRandom random = new SecureRandom();

  public RewardAccount createRewardAccount(User user) {
    RewardAccount rewardAccount = new RewardAccount();
    rewardAccount.setUser(user);
    rewardAccount.setTotalPoints(0);
    rewardAccount.setAvailablePoints(0);
    rewardAccount.setRedeemedPoints(0);

    return rewardAccountRepository.save(rewardAccount);
  }

  public RewardAccount getRewardAccountEntity(Long userId) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    return rewardAccountRepository
        .findByUser(user)
        .orElseThrow(() -> new RuntimeException("Reward account not found"));
  }

  public RewardAccountResponse getRewardAccount(Long userId) {
    RewardAccount account = getRewardAccountEntity(userId);
    String referralCode = generateReferralCode(userId);
    long totalReferrals = countUserReferrals(userId);

    return new RewardAccountResponse(
        account.getId(),
        account.getUser().getId(),
        account.getUser().getName(),
        new java.math.BigDecimal(account.getTotalPoints()),
        new java.math.BigDecimal(account.getAvailablePoints()),
        new java.math.BigDecimal(account.getRedeemedPoints()),
        referralCode,
        (int) totalReferrals,
        account.getCreatedAt(),
        account.getUpdatedAt());
  }

  public void awardPoints(User user, Integer points, String description) {
    RewardAccount account =
        rewardAccountRepository
            .findByUser(user)
            .orElseThrow(() -> new RuntimeException("Reward account not found"));

    account.setTotalPoints(account.getTotalPoints() + points);
    account.setAvailablePoints(account.getAvailablePoints() + points);

    rewardAccountRepository.save(account);

    // Create reward transaction record
    createRewardTransaction(account, TransactionType.EARNED, points, description);

    // Send notification
    notificationService.createNotification(
        user,
        "Points Earned!",
        "You earned " + points + " points: " + description,
        NotificationType.REFERRAL_BONUS);
  }

  public boolean redeemPoints(Long userId, Integer points, String description) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    RewardAccount account =
        rewardAccountRepository
            .findByUser(user)
            .orElseThrow(() -> new RuntimeException("Reward account not found"));

    if (account.getAvailablePoints() < points) {
      return false; // Insufficient points
    }

    account.setAvailablePoints(account.getAvailablePoints() - points);
    account.setRedeemedPoints(account.getRedeemedPoints() + points);

    rewardAccountRepository.save(account);

    // Create reward transaction record
    createRewardTransaction(account, TransactionType.REDEEMED, points, description);

    return true;
  }

  public void awardReferralBonus(User referrer, User referred) {
    // Award points to referrer
    awardPoints(referrer, 50, "Referral bonus for inviting " + referred.getFirstName());

    // Award points to referred user
    awardPoints(referred, 25, "Welcome bonus for joining through referral");
  }

  public void awardReviewBonus(User reviewer) {
    awardPoints(reviewer, 5, "Bonus for writing a review");
  }

  public void awardBookingBonus(User user) {
    awardPoints(user, 10, "Bonus for completing a booking");
  }

  // New methods for complete reward transaction handling
  public void createRewardTransaction(
      RewardAccount account, TransactionType type, Integer points, String description) {
    RewardTransaction transaction = new RewardTransaction();
    transaction.setRewardAccount(account);
    transaction.setType(type);
    transaction.setPoints(points);
    transaction.setDescription(description);

    rewardTransactionRepository.save(transaction);
  }

  public Page<RewardTransactionResponse> getRewardTransactions(Long userId, Pageable pageable) {
    RewardAccount account = getRewardAccountEntity(userId);
    Page<RewardTransaction> transactions =
        rewardTransactionRepository.findByRewardAccountOrderByCreatedAtDesc(account, pageable);

    return transactions.map(this::convertToRewardTransactionResponse);
  }

  private RewardTransactionResponse convertToRewardTransactionResponse(
      RewardTransaction transaction) {
    RewardTransactionResponse response = new RewardTransactionResponse();
    response.setId(transaction.getId());
    response.setUserId(transaction.getRewardAccount().getUser().getId());
    response.setUserName(transaction.getRewardAccount().getUser().getName());
    response.setType(transaction.getType());
    response.setAmount(new java.math.BigDecimal(transaction.getPoints()));
    response.setDescription(transaction.getDescription());
    response.setCreatedAt(transaction.getCreatedAt());
    return response;
  }

  public String generateReferralCode(Long userId) {
    // Create a unique referral code based on user ID and random characters
    StringBuilder code = new StringBuilder();
    code.append("REF");

    // Add user ID in base36 to keep it short
    code.append(Long.toString(userId, 36).toUpperCase());

    // Add random characters to ensure uniqueness
    for (int i = 0; i < REFERRAL_CODE_LENGTH - code.length(); i++) {
      int index = random.nextInt(REFERRAL_CODE_CHARACTERS.length());
      code.append(REFERRAL_CODE_CHARACTERS.charAt(index));
    }

    return code.toString();
  }

  public boolean redeemReferralCode(String referralCode, Long newUserId) {
    try {
      // Extract user ID from referral code (remove REF prefix and decode)
      String userIdPart = referralCode.substring(3);

      // Try different lengths to find the user ID part
      // Start with length 1 and increase until we find a valid user that exists
      for (int userIdLength = 1; userIdLength <= userIdPart.length(); userIdLength++) {
        try {
          String userIdStr = userIdPart.substring(0, userIdLength);
          Long referrerId = Long.parseLong(userIdStr, 36);

          // Check if this user exists
          User referrer = userRepository.findById(referrerId).orElse(null);
          if (referrer == null) {
            continue; // Try next length
          }

          // Validate users exist and are different
          User newUser = userRepository.findById(newUserId).orElse(null);

          if (newUser == null || referrerId.equals(newUserId)) {
            return false;
          }

          // Award referral bonus
          awardReferralBonus(referrer, newUser);
          return true;

        } catch (NumberFormatException e) {
          // Try next length
          continue;
        }
      }

      return false; // No valid user ID found

    } catch (Exception e) {
      return false;
    }
  }

  public long countUserReferrals(Long userId) {
    // Count referral transactions for this user
    RewardAccount account = getRewardAccountEntity(userId);
    return rewardTransactionRepository
        .findByRewardAccountOrderByCreatedAtDesc(account, Pageable.unpaged()).stream()
        .filter(t -> t.getDescription().contains("Referral bonus"))
        .count();
  }

  public RewardTransactionResponse redeemPointsWithTransaction(
      Long userId, Integer points, String description) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    RewardAccount account =
        rewardAccountRepository
            .findByUser(user)
            .orElseThrow(() -> new RuntimeException("Reward account not found"));

    if (account.getAvailablePoints() < points) {
      throw new RuntimeException("Insufficient points");
    }

    account.setAvailablePoints(account.getAvailablePoints() - points);
    account.setRedeemedPoints(account.getRedeemedPoints() + points);
    rewardAccountRepository.save(account);

    // Create reward transaction record
    createRewardTransaction(account, TransactionType.REDEEMED, points, description);

    // Return transaction response
    RewardTransaction transaction = new RewardTransaction();
    transaction.setRewardAccount(account);
    transaction.setType(TransactionType.REDEEMED);
    transaction.setPoints(points);
    transaction.setDescription(description);

    return convertToRewardTransactionResponse(transaction);
  }
}
