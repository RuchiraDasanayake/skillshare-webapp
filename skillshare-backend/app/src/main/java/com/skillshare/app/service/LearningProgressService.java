package com.skillshare.app.service;

import com.skillshare.app.dto.LearningProgressDTO;
import com.skillshare.app.model.*;
import com.skillshare.app.repository.LearningProgressRepository;
import com.skillshare.app.repository.UserRepository;
import com.skillshare.app.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningProgressService {
    @Autowired
    private LearningProgressRepository learningProgressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public LearningProgressDTO createLearningProgress(LearningProgressDTO progressDTO) {
        User user = userRepository.findById(progressDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LearningProgress progress = new LearningProgress();
        progress.setUser(user);
        progress.setType(LearningProgress.ProgressType.valueOf(progressDTO.getType()));
        
        if (progressDTO.getPlanItemId() != null) {
            LearningPlanItem item = learningPlanRepository.findItemById(progressDTO.getPlanItemId())
                    .orElseThrow(() -> new RuntimeException("Plan item not found"));
            progress.setLearningPlanItem(item);
        }
        
        progress.setTitle(progressDTO.getTitle());
        progress.setDescription(progressDTO.getDescription());
        progress.setSkillsLearned(progressDTO.getSkillsLearned());
        progress.setCompletionDate(progressDTO.getCompletionDate());
        progress.setCompletionPercentage(progressDTO.getCompletionPercentage());
        
        LearningProgress savedProgress = learningProgressRepository.save(progress);
        
        // Notify followers about progress update
        if (progress.getType() == LearningProgress.ProgressType.COMPLETED_TUTORIAL || 
            progress.getType() == LearningProgress.ProgressType.MILESTONE) {
            notificationService.notifyProgressUpdate(user, savedProgress);
        }
        
        return convertToDTO(savedProgress);
    }
    
    public List<LearningProgressDTO> getUserProgressByType(Long userId, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return learningProgressRepository.findByUserAndType(user, LearningProgress.ProgressType.valueOf(type)).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LearningProgressDTO> getUserProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return learningProgressRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public LearningProgressDTO addNewSkill(Long userId, String skillName, String description) {
        LearningProgressDTO progressDTO = new LearningProgressDTO();
        progressDTO.setUserId(userId);
        progressDTO.setType("NEW_SKILL");
        progressDTO.setTitle("Learned: " + skillName);
        progressDTO.setDescription(description);
        progressDTO.setSkillsLearned(skillName);
        progressDTO.setCompletionDate(LocalDate.now());
        progressDTO.setCompletionPercentage(100);
        
        return createLearningProgress(progressDTO);
    }
    
    public LearningProgressDTO addMilestone(Long userId, String title, String description, String skills) {
        LearningProgressDTO progressDTO = new LearningProgressDTO();
        progressDTO.setUserId(userId);
        progressDTO.setType("MILESTONE");
        progressDTO.setTitle(title);
        progressDTO.setDescription(description);
        progressDTO.setSkillsLearned(skills);
        progressDTO.setCompletionDate(LocalDate.now());
        progressDTO.setCompletionPercentage(100);
        
        return createLearningProgress(progressDTO);
    }
    
    private LearningProgressDTO convertToDTO(LearningProgress progress) {
        LearningProgressDTO dto = new LearningProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        
        if (progress.getLearningPlanItem() != null) {
            dto.setPlanItemId(progress.getLearningPlanItem().getId());
            dto.setResourceUrl(progress.getLearningPlanItem().getResourceUrl());
        }
        
        dto.setType(progress.getType().name());
        dto.setTitle(progress.getTitle());
        dto.setDescription(progress.getDescription());
        dto.setSkillsLearned(progress.getSkillsLearned());
        dto.setCompletionDate(progress.getCompletionDate());
        dto.setCompletionPercentage(progress.getCompletionPercentage());
        return dto;
    }
}