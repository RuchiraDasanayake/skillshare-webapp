package com.skillshare.app.service;

import com.skillshare.app.dto.LearningProgressDTO;
import com.skillshare.app.exception.ResourceNotFoundException;
import com.skillshare.app.model.LearningProgress;
import com.skillshare.app.model.Notification;
import com.skillshare.app.model.User;
import com.skillshare.app.repository.LearningProgressRepository;
import com.skillshare.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public LearningProgressDTO createProgress(LearningProgressDTO dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LearningProgress progress = new LearningProgress();
        progress.setUser(user);
        progress.setType(LearningProgress.ProgressType.valueOf(dto.getType()));
        progress.setTitle(dto.getTitle());
        progress.setDescription(dto.getDescription());
        progress.setSkillsLearned(dto.getSkillsLearned());
        progress.setCompletionDate(dto.getCompletionDate());
        progress.setCompletionPercentage(dto.getCompletionPercentage());

        LearningProgress saved = progressRepository.save(progress);

        if (progress.getType() == LearningProgress.ProgressType.COMPLETED_TUTORIAL) {
            Notification notification = new Notification();
            notification.setRecipient(user);
            notification.setMessage("You completed: " + progress.getTitle());
            notification.setType("PROGRESS_UPDATE");
            notificationService.createNotification(notification);
        }

        return convertToDTO(saved);
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

    @Transactional
    public void updateSummary(Long id, String summary) {
        LearningProgress progress = progressRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));
        progress.setDescription(summary);
        progressRepository.save(progress);
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
