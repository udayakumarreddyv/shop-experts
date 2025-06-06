package com.shopexperts.repository;

import com.shopexperts.model.RewardAccount;
import com.shopexperts.model.RewardTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
  Page<RewardTransaction> findByRewardAccountOrderByCreatedAtDesc(
      RewardAccount rewardAccount, Pageable pageable);
}
