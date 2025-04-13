package com.skillshare.app.service;

import com.skillshare.app.dto.LearningProgressDTO;
import com.skillshare.app.exception.ResourceNotFoundException;
import com.skillshare.app.model.LearningProgress;
import com.skillshare.app.model.User;
import com.skillshare.app.repository.LearningProgressRepository;
import com.skillshare.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.skillshare.app.model.Notification; // Add this import

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningProgressService {
    private final LearningProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public LearningProgressService(LearningProgressRepository progressRepository,
                                 UserRepository userRepository,
                                 NotificationService notificationService) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public LearningProgressDTO createProgress(LearningProgressDTO progressDTO) {
        User user = userRepository.findById(progressDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LearningProgress progress = new LearningProgress();
        progress.setUser(user);
        progress.setType(LearningProgress.ProgressType.valueOf(progressDTO.getType()));
        progress.setTitle(progressDTO.getTitle());
        progress.setDescription(progressDTO.getDescription());
        progress.setSkillsLearned(progressDTO.getSkillsLearned());
        progress.setCompletionDate(progressDTO.getCompletionDate());
        progress.setCompletionPercentage(progressDTO.getCompletionPercentage());

        LearningProgress savedProgress = progressRepository.save(progress);
        
        if (progress.getType() == LearningProgress.ProgressType.COMPLETED_TUTORIAL) {
            createProgressNotification(user, progress);
        }

        return convertToDTO(savedProgress);
    }

    @Transactional(readOnly = true)
    public List<LearningProgressDTO> getUserProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return progressRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LearningProgressDTO> getUserProgressByType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return progressRepository.findByUserAndType(user, LearningProgress.ProgressType.valueOf(type)).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void createProgressNotification(User user, LearningProgress progress) {
        Notification notification = new Notification();
        notification.setRecipient(user);
        notification.setMessage("You completed: " + progress.getTitle());
        notification.setType("PROGRESS_UPDATE");
        
        notificationService.createNotification(notification);
    }

    private LearningProgressDTO convertToDTO(LearningProgress progress) {
        LearningProgressDTO dto = new LearningProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setType(progress.getType().name());
        dto.setTitle(progress.getTitle());
        dto.setDescription(progress.getDescription());
        dto.setSkillsLearned(progress.getSkillsLearned());
        dto.setCompletionDate(progress.getCompletionDate());
        dto.setCompletionPercentage(progress.getCompletionPercentage());
        return dto;
    }
}