package com.shopexperts.repository;

import com.shopexperts.model.RewardAccount;
import com.shopexperts.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardAccountRepository extends JpaRepository<RewardAccount, Long> {
  Optional<RewardAccount> findByUser(User user);
}
