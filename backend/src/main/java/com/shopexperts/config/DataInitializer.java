package com.shopexperts.config;

import com.shopexperts.model.AuthProvider;
import com.shopexperts.model.Role;
import com.shopexperts.model.RoleName;
import com.shopexperts.model.User;
import com.shopexperts.repository.RoleRepository;
import com.shopexperts.repository.UserRepository;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  @Autowired private RoleRepository roleRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    // Create default roles
    if (!roleRepository.findByName(RoleName.ROLE_USER).isPresent()) {
      roleRepository.save(new Role(RoleName.ROLE_USER));
    }

    if (!roleRepository.findByName(RoleName.ROLE_TALENT).isPresent()) {
      roleRepository.save(new Role(RoleName.ROLE_TALENT));
    }

    if (!roleRepository.findByName(RoleName.ROLE_BUSINESS).isPresent()) {
      roleRepository.save(new Role(RoleName.ROLE_BUSINESS));
    }

    if (!roleRepository.findByName(RoleName.ROLE_ADMIN).isPresent()) {
      roleRepository.save(new Role(RoleName.ROLE_ADMIN));
    }

    // Create default admin user
    if (!userRepository.existsByEmail("admin@shopexperts.com")) {
      User admin = new User();
      admin.setFirstName("Admin");
      admin.setLastName("User");
      admin.setEmail("admin@shopexperts.com");
      admin.setPassword(passwordEncoder.encode("admin123"));
      admin.setProvider(AuthProvider.LOCAL);
      admin.setEmailVerified(true);

      Role adminRole =
          roleRepository
              .findByName(RoleName.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Admin Role not found"));

      admin.setRoles(Collections.singleton(adminRole));
      userRepository.save(admin);

      System.out.println("Default admin user created: admin@shopexperts.com / admin123");
    }
  }
}
