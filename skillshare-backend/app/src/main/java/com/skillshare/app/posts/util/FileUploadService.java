package com.skillshare.app.posts.util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    private final Path rootLocation = Paths.get("uploads");

    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName));
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}