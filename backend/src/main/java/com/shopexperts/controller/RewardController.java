package com.shopexperts.controller;

import com.shopexperts.payload.RewardAccountResponse;
import com.shopexperts.payload.RewardTransactionRequest;
import com.shopexperts.payload.RewardTransactionResponse;
import com.shopexperts.security.CurrentUser;
import com.shopexperts.security.UserPrincipal;
import com.shopexperts.service.RewardService;
import java.util.HashMap;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "http://localhost:3000")
public class RewardController {

  @Autowired private RewardService rewardService;

  @GetMapping("/account")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<RewardAccountResponse> getRewardAccount(
      @CurrentUser UserPrincipal currentUser) {
    RewardAccountResponse account = rewardService.getRewardAccount(currentUser.getId());
    return ResponseEntity.ok(account);
  }

  @GetMapping("/transactions")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Page<RewardTransactionResponse>> getRewardTransactions(
      @CurrentUser UserPrincipal currentUser, Pageable pageable) {
    Page<RewardTransactionResponse> transactions =
        rewardService.getRewardTransactions(currentUser.getId(), pageable);
    return ResponseEntity.ok(transactions);
  }

  @PostMapping("/redeem")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<RewardTransactionResponse> redeemPoints(
      @Valid @RequestBody RewardTransactionRequest request,
      @CurrentUser UserPrincipal currentUser) {
    try {
      RewardTransactionResponse transaction =
          rewardService.redeemPointsWithTransaction(
              currentUser.getId(), request.getAmount().intValue(), request.getDescription());
      return ResponseEntity.ok(transaction);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/referral")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Map<String, String>> generateReferralCode(
      @CurrentUser UserPrincipal currentUser) {
    String referralCode = rewardService.generateReferralCode(currentUser.getId());
    Map<String, String> response = new HashMap<>();
    response.put("referralCode", referralCode);
    response.put("message", "Referral code generated successfully");
    return ResponseEntity.ok(response);
  }

  @PostMapping("/referral/redeem/{referralCode}")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Map<String, Object>> redeemReferralCode(
      @PathVariable String referralCode, @CurrentUser UserPrincipal currentUser) {
    boolean success = rewardService.redeemReferralCode(referralCode, currentUser.getId());
    Map<String, Object> response = new HashMap<>();

    if (success) {
      response.put("success", true);
      response.put("message", "Referral code redeemed successfully! Welcome bonus awarded.");
    } else {
      response.put("success", false);
      response.put("message", "Invalid or expired referral code.");
    }

    return ResponseEntity.ok(response);
  }

  @GetMapping("/leaderboard")
  public ResponseEntity<?> getRewardLeaderboard(@RequestParam(defaultValue = "10") int limit) {
    // Will implement later
    return ResponseEntity.ok(new HashMap<>());
  }

  @GetMapping("/referral/stats")
  @PreAuthorize("hasRole('USER') or hasRole('EXPERT')")
  public ResponseEntity<Map<String, Object>> getReferralStats(
      @CurrentUser UserPrincipal currentUser) {
    Map<String, Object> stats = new HashMap<>();
    RewardAccountResponse account = rewardService.getRewardAccount(currentUser.getId());

    stats.put("referralCode", account.getReferralCode());
    stats.put("totalReferrals", account.getTotalReferrals());
    stats.put("referralBonus", account.getTotalReferrals() * 50); // 50 points per referral

    return ResponseEntity.ok(stats);
  }

  @GetMapping("/admin/transactions")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<RewardTransactionResponse>> getAllRewardTransactions(
      Pageable pageable) {
    // Will implement later
    return ResponseEntity.ok(Page.empty());
  }

  @PostMapping("/admin/award")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<RewardTransactionResponse> awardPoints(
      @Valid @RequestBody RewardTransactionRequest request) {
    // Will implement later
    return ResponseEntity.ok(new RewardTransactionResponse());
  }
}
