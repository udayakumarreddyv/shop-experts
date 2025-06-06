package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

  @InjectMocks private PaymentService paymentService;

  private final String mockStripeApiKey = "sk_test_mock_key";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(paymentService, "stripeApiKey", mockStripeApiKey);
  }

  @Test
  void createPaymentIntent_WithValidAmount_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = new BigDecimal("50.00");
    String currency = "usd";
    String description = "Test payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
    assertTrue(paymentIntentId.length() > 8); // Should have timestamp appended
  }

  @Test
  void createPaymentIntent_WithLargeAmount_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = new BigDecimal("1000.99");
    String currency = "usd";
    String description = "Large payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
  }

  @Test
  void createPaymentIntent_WithZeroAmount_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = BigDecimal.ZERO;
    String currency = "usd";
    String description = "Zero amount payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
  }

  @Test
  void createPaymentIntent_WithDifferentCurrency_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = new BigDecimal("25.50");
    String currency = "eur";
    String description = "Euro payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
  }

  @Test
  void createPaymentIntent_WithNullDescription_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = new BigDecimal("30.00");
    String currency = "usd";
    String description = null;

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
  }

  @Test
  void createPaymentIntent_WithEmptyDescription_ShouldReturnPaymentIntentId() {
    // Arrange
    BigDecimal amount = new BigDecimal("15.75");
    String currency = "usd";
    String description = "";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
  }

  @Test
  void createPaymentIntent_MultipleCalls_ShouldReturnUniqueIds() {
    // Arrange
    BigDecimal amount = new BigDecimal("20.00");
    String currency = "usd";
    String description = "Test payment";

    // Act
    String paymentIntentId1 = paymentService.createPaymentIntent(amount, currency, description);

    // Small delay to ensure different timestamps
    try {
      Thread.sleep(1);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }

    String paymentIntentId2 = paymentService.createPaymentIntent(amount, currency, description);

    // Assert
    assertNotNull(paymentIntentId1);
    assertNotNull(paymentIntentId2);
    assertNotEquals(paymentIntentId1, paymentIntentId2);
    assertTrue(paymentIntentId1.startsWith("pi_mock_"));
    assertTrue(paymentIntentId2.startsWith("pi_mock_"));
  }

  @Test
  void confirmPayment_WithValidPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = "pi_mock_12345";

    // Act
    boolean result = paymentService.confirmPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void confirmPayment_WithNullPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = null;

    // Act
    boolean result = paymentService.confirmPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void confirmPayment_WithEmptyPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = "";

    // Act
    boolean result = paymentService.confirmPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void refundPayment_WithValidPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = "pi_mock_12345";

    // Act
    boolean result = paymentService.refundPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void refundPayment_WithNullPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = null;

    // Act
    boolean result = paymentService.refundPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void refundPayment_WithEmptyPaymentIntentId_ShouldReturnTrue() {
    // Arrange
    String paymentIntentId = "";

    // Act
    boolean result = paymentService.refundPayment(paymentIntentId);

    // Assert
    assertTrue(result);
  }

  @Test
  void getPaymentStatus_WithValidPaymentIntentId_ShouldReturnSucceeded() {
    // Arrange
    String paymentIntentId = "pi_mock_12345";

    // Act
    String status = paymentService.getPaymentStatus(paymentIntentId);

    // Assert
    assertEquals("succeeded", status);
  }

  @Test
  void getPaymentStatus_WithNullPaymentIntentId_ShouldReturnSucceeded() {
    // Arrange
    String paymentIntentId = null;

    // Act
    String status = paymentService.getPaymentStatus(paymentIntentId);

    // Assert
    assertEquals("succeeded", status);
  }

  @Test
  void getPaymentStatus_WithEmptyPaymentIntentId_ShouldReturnSucceeded() {
    // Arrange
    String paymentIntentId = "";

    // Act
    String status = paymentService.getPaymentStatus(paymentIntentId);

    // Assert
    assertEquals("succeeded", status);
  }

  @Test
  void paymentWorkflow_CreateConfirmAndCheck_ShouldWorkCorrectly() {
    // Arrange
    BigDecimal amount = new BigDecimal("100.00");
    String currency = "usd";
    String description = "Test booking payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);
    boolean confirmationResult = paymentService.confirmPayment(paymentIntentId);
    String status = paymentService.getPaymentStatus(paymentIntentId);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(paymentIntentId.startsWith("pi_mock_"));
    assertTrue(confirmationResult);
    assertEquals("succeeded", status);
  }

  @Test
  void refundWorkflow_CreateConfirmAndRefund_ShouldWorkCorrectly() {
    // Arrange
    BigDecimal amount = new BigDecimal("75.50");
    String currency = "usd";
    String description = "Refundable booking payment";

    // Act
    String paymentIntentId = paymentService.createPaymentIntent(amount, currency, description);
    boolean confirmationResult = paymentService.confirmPayment(paymentIntentId);
    boolean refundResult = paymentService.refundPayment(paymentIntentId);

    // Assert
    assertNotNull(paymentIntentId);
    assertTrue(confirmationResult);
    assertTrue(refundResult);
  }

  @Test
  void createPaymentIntent_WithDecimalAmounts_ShouldHandleCorrectly() {
    // Arrange
    BigDecimal amount1 = new BigDecimal("99.99");
    BigDecimal amount2 = new BigDecimal("0.01");
    BigDecimal amount3 = new BigDecimal("123.456"); // More than 2 decimal places
    String currency = "usd";
    String description = "Decimal amount test";

    // Act
    String paymentIntentId1 = paymentService.createPaymentIntent(amount1, currency, description);
    String paymentIntentId2 = paymentService.createPaymentIntent(amount2, currency, description);
    String paymentIntentId3 = paymentService.createPaymentIntent(amount3, currency, description);

    // Assert
    assertNotNull(paymentIntentId1);
    assertNotNull(paymentIntentId2);
    assertNotNull(paymentIntentId3);
    assertTrue(paymentIntentId1.startsWith("pi_mock_"));
    assertTrue(paymentIntentId2.startsWith("pi_mock_"));
    assertTrue(paymentIntentId3.startsWith("pi_mock_"));
  }
}
