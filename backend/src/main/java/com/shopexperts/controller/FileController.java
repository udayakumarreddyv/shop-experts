package com.shopexperts.controller;

import com.shopexperts.service.FileStorageService;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

  @Autowired private FileStorageService fileStorageService;

  @GetMapping("/uploads/{subDirectory}/{filename:.+}")
  public ResponseEntity<Resource> downloadFile(
      @PathVariable String subDirectory, @PathVariable String filename) {
    try {
      Path filePath = Paths.get("uploads", subDirectory, filename);
      Resource resource = new UrlResource(filePath.toUri());

      if (resource.exists() && resource.isReadable()) {
        String contentType = determineContentType(filename);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
            .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  private String determineContentType(String filename) {
    String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream";
    }
  }
}
