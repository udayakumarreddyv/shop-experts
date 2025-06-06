package com.shopexperts.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  @Value("${app.file.upload-dir:uploads}")
  private String uploadDir;

  public String storeFile(MultipartFile file, String subDirectory) throws IOException {
    // Create upload directory if it doesn't exist
    Path uploadPath = Paths.get(uploadDir, subDirectory);
    if (!Files.exists(uploadPath)) {
      Files.createDirectories(uploadPath);
    }

    // Validate file
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Cannot store empty file");
    }

    // Generate unique filename
    String originalFilename = file.getOriginalFilename();
    String fileExtension =
        originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";

    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    String uniqueFilename = timestamp + "_" + UUID.randomUUID().toString() + fileExtension;

    // Store file
    Path targetLocation = uploadPath.resolve(uniqueFilename);
    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

    // Return relative path for database storage
    return subDirectory + "/" + uniqueFilename;
  }

  public boolean deleteFile(String filePath) {
    try {
      Path path = Paths.get(uploadDir, filePath);
      return Files.deleteIfExists(path);
    } catch (IOException | InvalidPathException e) {
      return false;
    }
  }

  public boolean isValidImageFile(MultipartFile file) {
    String contentType = file.getContentType();
    return contentType != null
        && (contentType.equals("image/jpeg")
            || contentType.equals("image/png")
            || contentType.equals("image/jpg")
            || contentType.equals("image/webp"));
  }

  public boolean isValidFileSize(MultipartFile file, long maxSizeInBytes) {
    return file.getSize() <= maxSizeInBytes;
  }
}
