package com.skillshare.app.posts.service;
import com.skillshare.app.posts.exception.ResourceNotFoundException;
import com.skillshare.app.posts.model.Media;
import com.skillshare.app.posts.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final MediaRepository mediaRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Media uploadMedia(MultipartFile file) {
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            @SuppressWarnings("null")
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID() + fileExtension;

            // Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Save file
            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create Media entity
            Media media = new Media();
            media.setFileName(uniqueFilename);
            media.setFileType(file.getContentType());
            media.setFileUrl("/uploads/" + uniqueFilename);
            media.setFileSize(file.getSize());

            // Save media metadata
            return mediaRepository.save(media);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    public void deleteMedia(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
            .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        try {
            // Delete physical file
            Path filePath = Paths.get(uploadDir).resolve(media.getFileName());
            Files.deleteIfExists(filePath);

            // Delete media metadata
            mediaRepository.delete(media);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + media.getFileName(), ex);
        }
    }
}
