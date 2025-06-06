package com.shopexperts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class FileStorageServiceTest {

  @InjectMocks private FileStorageService fileStorageService;

  @Mock private MultipartFile multipartFile;

  @TempDir Path tempDir;

  private String uploadDir;

  @BeforeEach
  void setUp() {
    uploadDir = tempDir.toString();
    ReflectionTestUtils.setField(fileStorageService, "uploadDir", uploadDir);
  }

  @Test
  void storeFile_WithValidFile_ShouldStoreFileAndReturnPath() throws IOException {
    // Arrange
    String subDirectory = "images";
    String originalFilename = "test.jpg";
    byte[] fileContent = "test file content".getBytes();
    InputStream inputStream = new ByteArrayInputStream(fileContent);

    when(multipartFile.isEmpty()).thenReturn(false);
    when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
    when(multipartFile.getInputStream()).thenReturn(inputStream);

    // Act
    String result = fileStorageService.storeFile(multipartFile, subDirectory);

    // Assert
    assertNotNull(result);
    assertTrue(result.startsWith(subDirectory + "/"));
    assertTrue(result.endsWith(".jpg"));
    assertTrue(result.contains("_")); // Should contain timestamp

    // Verify file was created
    Path expectedPath = Paths.get(uploadDir, result);
    assertTrue(Files.exists(expectedPath));

    verify(multipartFile).isEmpty();
    verify(multipartFile).getOriginalFilename();
    verify(multipartFile).getInputStream();
  }

  @Test
  void storeFile_WithEmptyFile_ShouldThrowException() {
    // Arrange
    String subDirectory = "images";
    when(multipartFile.isEmpty()).thenReturn(true);

    // Act & Assert
    IllegalArgumentException exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> fileStorageService.storeFile(multipartFile, subDirectory));

    assertEquals("Cannot store empty file", exception.getMessage());
    verify(multipartFile).isEmpty();
    // Note: getInputStream() should not be called for empty files
  }

  @Test
  void storeFile_WithNullFilename_ShouldStoreFileWithoutExtension() throws IOException {
    // Arrange
    String subDirectory = "documents";
    byte[] fileContent = "test content".getBytes();
    InputStream inputStream = new ByteArrayInputStream(fileContent);

    when(multipartFile.isEmpty()).thenReturn(false);
    when(multipartFile.getOriginalFilename()).thenReturn(null);
    when(multipartFile.getInputStream()).thenReturn(inputStream);

    // Act
    String result = fileStorageService.storeFile(multipartFile, subDirectory);

    // Assert
    assertNotNull(result);
    assertTrue(result.startsWith(subDirectory + "/"));
    assertFalse(result.contains(".")); // No extension since filename was null

    verify(multipartFile).isEmpty();
    verify(multipartFile).getOriginalFilename();
    verify(multipartFile).getInputStream();
  }

  @Test
  void storeFile_WithFilenameWithoutExtension_ShouldStoreFileWithoutExtension() throws IOException {
    // Arrange
    String subDirectory = "documents";
    String originalFilename = "testfile";
    byte[] fileContent = "test content".getBytes();
    InputStream inputStream = new ByteArrayInputStream(fileContent);

    when(multipartFile.isEmpty()).thenReturn(false);
    when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
    when(multipartFile.getInputStream()).thenReturn(inputStream);

    // Act
    String result = fileStorageService.storeFile(multipartFile, subDirectory);

    // Assert
    assertNotNull(result);
    assertTrue(result.startsWith(subDirectory + "/"));
    assertFalse(result.endsWith("."));

    verify(multipartFile).isEmpty();
    verify(multipartFile).getOriginalFilename();
    verify(multipartFile).getInputStream();
  }

  @Test
  void storeFile_WithNewSubDirectory_ShouldCreateDirectoryAndStoreFile() throws IOException {
    // Arrange
    String subDirectory = "new/nested/directory";
    String originalFilename = "test.png";
    byte[] fileContent = "image content".getBytes();
    InputStream inputStream = new ByteArrayInputStream(fileContent);

    when(multipartFile.isEmpty()).thenReturn(false);
    when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
    when(multipartFile.getInputStream()).thenReturn(inputStream);

    // Act
    String result = fileStorageService.storeFile(multipartFile, subDirectory);

    // Assert
    assertNotNull(result);
    assertTrue(result.startsWith(subDirectory + "/"));
    assertTrue(result.endsWith(".png"));

    // Verify directory was created
    Path directoryPath = Paths.get(uploadDir, subDirectory);
    assertTrue(Files.exists(directoryPath));
    assertTrue(Files.isDirectory(directoryPath));

    verify(multipartFile).isEmpty();
    verify(multipartFile).getOriginalFilename();
    verify(multipartFile).getInputStream();
  }

  @Test
  void storeFile_MultipleFiles_ShouldGenerateUniqueFilenames() throws IOException {
    // Arrange
    String subDirectory = "images";
    String originalFilename = "test.jpg";
    byte[] fileContent = "test content".getBytes();

    when(multipartFile.isEmpty()).thenReturn(false);
    when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
    when(multipartFile.getInputStream())
        .thenReturn(new ByteArrayInputStream(fileContent))
        .thenReturn(new ByteArrayInputStream(fileContent));

    // Act
    String result1 = fileStorageService.storeFile(multipartFile, subDirectory);

    // Small delay to ensure different timestamps
    try {
      Thread.sleep(1);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }

    String result2 = fileStorageService.storeFile(multipartFile, subDirectory);

    // Assert
    assertNotNull(result1);
    assertNotNull(result2);
    assertNotEquals(result1, result2);
    assertTrue(result1.startsWith(subDirectory + "/"));
    assertTrue(result2.startsWith(subDirectory + "/"));
    assertTrue(result1.endsWith(".jpg"));
    assertTrue(result2.endsWith(".jpg"));
  }

  @Test
  void deleteFile_WithExistingFile_ShouldReturnTrue() throws IOException {
    // Arrange
    String relativePath = "images/test.jpg";
    Path fullPath = Paths.get(uploadDir, relativePath);
    Files.createDirectories(fullPath.getParent());
    Files.createFile(fullPath);

    // Act
    boolean result = fileStorageService.deleteFile(relativePath);

    // Assert
    assertTrue(result);
    assertFalse(Files.exists(fullPath));
  }

  @Test
  void deleteFile_WithNonExistentFile_ShouldReturnFalse() {
    // Arrange
    String relativePath = "images/nonexistent.jpg";

    // Act
    boolean result = fileStorageService.deleteFile(relativePath);

    // Assert
    assertFalse(result);
  }

  @Test
  void deleteFile_WithInvalidPath_ShouldReturnFalse() {
    // Arrange
    String relativePath = "invalid/path/with/\0/null/characters";

    // Act
    boolean result = fileStorageService.deleteFile(relativePath);

    // Assert
    assertFalse(result);
  }

  @Test
  void isValidImageFile_WithValidJpegFile_ShouldReturnTrue() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("image/jpeg");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertTrue(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithValidPngFile_ShouldReturnTrue() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("image/png");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertTrue(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithValidJpgFile_ShouldReturnTrue() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("image/jpg");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertTrue(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithValidWebpFile_ShouldReturnTrue() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("image/webp");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertTrue(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithInvalidContentType_ShouldReturnFalse() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("application/pdf");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertFalse(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithNullContentType_ShouldReturnFalse() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn(null);

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertFalse(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidImageFile_WithEmptyContentType_ShouldReturnFalse() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("");

    // Act
    boolean result = fileStorageService.isValidImageFile(multipartFile);

    // Assert
    assertFalse(result);
    verify(multipartFile).getContentType();
  }

  @Test
  void isValidFileSize_WithValidSize_ShouldReturnTrue() {
    // Arrange
    long maxSizeInBytes = 1024 * 1024; // 1MB
    when(multipartFile.getSize()).thenReturn(500L * 1024); // 500KB

    // Act
    boolean result = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertTrue(result);
    verify(multipartFile).getSize();
  }

  @Test
  void isValidFileSize_WithExactMaxSize_ShouldReturnTrue() {
    // Arrange
    long maxSizeInBytes = 1024 * 1024; // 1MB
    when(multipartFile.getSize()).thenReturn(maxSizeInBytes);

    // Act
    boolean result = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertTrue(result);
    verify(multipartFile).getSize();
  }

  @Test
  void isValidFileSize_WithExceedingSize_ShouldReturnFalse() {
    // Arrange
    long maxSizeInBytes = 1024 * 1024; // 1MB
    when(multipartFile.getSize()).thenReturn(2L * 1024 * 1024); // 2MB

    // Act
    boolean result = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertFalse(result);
    verify(multipartFile).getSize();
  }

  @Test
  void isValidFileSize_WithZeroSize_ShouldReturnTrue() {
    // Arrange
    long maxSizeInBytes = 1024 * 1024; // 1MB
    when(multipartFile.getSize()).thenReturn(0L);

    // Act
    boolean result = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertTrue(result);
    verify(multipartFile).getSize();
  }

  @Test
  void isValidFileSize_WithZeroMaxSize_ShouldReturnFalseForNonZeroFile() {
    // Arrange
    long maxSizeInBytes = 0L;
    when(multipartFile.getSize()).thenReturn(100L);

    // Act
    boolean result = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertFalse(result);
    verify(multipartFile).getSize();
  }

  @Test
  void fileValidation_CompleteWorkflow_ShouldValidateCorrectly() {
    // Arrange
    when(multipartFile.getContentType()).thenReturn("image/jpeg");
    when(multipartFile.getSize()).thenReturn(500L * 1024); // 500KB
    long maxSizeInBytes = 1024 * 1024; // 1MB

    // Act
    boolean isValidImage = fileStorageService.isValidImageFile(multipartFile);
    boolean isValidSize = fileStorageService.isValidFileSize(multipartFile, maxSizeInBytes);

    // Assert
    assertTrue(isValidImage);
    assertTrue(isValidSize);
    verify(multipartFile).getContentType();
    verify(multipartFile).getSize();
  }
}
