package com.shopexperts.controller;

import com.shopexperts.payload.ApiResponse;
import com.shopexperts.payload.JwtAuthenticationResponse;
import com.shopexperts.payload.UserSummary;
import com.shopexperts.payload.request.LoginRequest;
import com.shopexperts.payload.request.SignupRequest;
import com.shopexperts.security.JwtTokenProvider;
import com.shopexperts.service.UserService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

  @Autowired AuthenticationManager authenticationManager;

  @Autowired UserService userService;

  @Autowired JwtTokenProvider tokenProvider;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);

      String jwt = tokenProvider.generateToken(authentication);

      UserSummary userSummary =
          userService.getCurrentUser(
              ((com.shopexperts.security.UserPrincipal) authentication.getPrincipal()).getId());

      return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, userSummary));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid email or password"));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userService.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Email Address already in use!"));
    }

    try {
      userService.createUser(signUpRequest);
      return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
    }
  }

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
    try {
      String jwt = token.substring(7); // Remove "Bearer " prefix
      Long userId = tokenProvider.getUserIdFromJWT(jwt);
      UserSummary userSummary = userService.getCurrentUser(userId);

      return ResponseEntity.ok(userSummary);
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponse(false, "Error fetching user details"));
    }
  }
}
