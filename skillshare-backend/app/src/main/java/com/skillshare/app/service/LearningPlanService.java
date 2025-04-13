package com.skillshare.app.service;

import com.skillshare.app.dto.LearningPlanDTO;
import com.skillshare.app.dto.LearningPlanItemDTO;
import com.skillshare.app.model.*;
import com.skillshare.app.repository.LearningPlanRepository;
import com.skillshare.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LearningProgressService learningProgressService;
    
    @Transactional
    public LearningPlanDTO createLearningPlan(LearningPlanDTO planDTO) {
        User user = userRepository.findById(planDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LearningPlan plan = new LearningPlan();
        plan.setUser(user);
        plan.setTitle(planDTO.getTitle());
        plan.setDescription(planDTO.getDescription());
        plan.setStartDate(planDTO.getStartDate());
        plan.setTargetCompletionDate(planDTO.getTargetCompletionDate());
        plan.setPublic(planDTO.isPublic());
        
        LearningPlan savedPlan = learningPlanRepository.save(plan);
        
        // Save plan items
        if (planDTO.getItems() != null) {
            for (LearningPlanItemDTO itemDTO : planDTO.getItems()) {
                LearningPlanItem item = new LearningPlanItem();
                item.setLearningPlan(savedPlan);
                item.setTitle(itemDTO.getTitle());
                item.setDescription(itemDTO.getDescription());
                item.setResourceUrl(itemDTO.getResourceUrl());
                item.setCompletionPercentage(itemDTO.getCompletionPercentage());
                item.setCompleted(itemDTO.isCompleted());
                item.setCompletedDate(itemDTO.getCompletedDate());
                
                savedPlan.getItems().add(item);
            }
        }
        
        learningPlanRepository.save(savedPlan);
        return convertToDTO(savedPlan);
    }
    
    public List<LearningPlanDTO> getUserLearningPlans(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return learningPlanRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public LearningPlanDTO updatePlanItemProgress(Long itemId, int completionPercentage, boolean isCompleted) {
        LearningPlanItem item = learningPlanRepository.findItemById(itemId)
                .orElseThrow(() -> new RuntimeException("Plan item not found"));
        
        item.setCompletionPercentage(completionPercentage);
        item.setCompleted(isCompleted);
        if (isCompleted) {
            item.setCompletedDate(LocalDate.now());
            
            // Create a progress update for completed items
            LearningProgressDTO progressDTO = new LearningProgressDTO();
            progressDTO.setUserId(item.getLearningPlan().getUser().getId());
            progressDTO.setPlanItemId(itemId);
            progressDTO.setType("COMPLETED_TUTORIAL");
            progressDTO.setTitle(item.getTitle());
            progressDTO.setDescription(item.getDescription());
            progressDTO.setCompletionDate(LocalDate.now());
            progressDTO.setCompletionPercentage(100);
            
            learningProgressService.createLearningProgress(progressDTO);
        }
        
        learningPlanRepository.saveItem(item);
        
        // For ongoing tutorials, create a progress update if significant progress made
        if (!isCompleted && completionPercentage > 0 && completionPercentage % 25 == 0) {
            LearningProgressDTO progressDTO = new LearningProgressDTO();
            progressDTO.setUserId(item.getLearningPlan().getUser().getId());
            progressDTO.setPlanItemId(itemId);
            progressDTO.setType("ONGOING_TUTORIAL");
            progressDTO.setTitle(item.getTitle());
            progressDTO.setDescription("Reached " + completionPercentage + "% completion");
            progressDTO.setCompletionPercentage(completionPercentage);
            progressDTO.setResourceUrl(item.getResourceUrl());
            
            learningProgressService.createLearningProgress(progressDTO);
        }
        
        return convertToDTO(item.getLearningPlan());
    }
    
    private LearningPlanDTO convertToDTO(LearningPlan plan) {
        LearningPlanDTO dto = new LearningPlanDTO();
        dto.setId(plan.getId());
        dto.setUserId(plan.getUser().getId());
        dto.setTitle(plan.getTitle());
        dto.setDescription(plan.getDescription());
        dto.setStartDate(plan.getStartDate());
        dto.setTargetCompletionDate(plan.getTargetCompletionDate());
        dto.setPublic(plan.isPublic());
        
        if (plan.getItems() != null) {
            dto.setItems(plan.getItems().stream()
                    .map(this::convertItemToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private LearningPlanItemDTO convertItemToDTO(LearningPlanItem item) {
        LearningPlanItemDTO dto = new LearningPlanItemDTO();
        dto.setId(item.getId());
        dto.setPlanId(item.getLearningPlan().getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setResourceUrl(item.getResourceUrl());
        dto.setCompletionPercentage(item.getCompletionPercentage());
        dto.setCompleted(item.isCompleted());
        dto.setCompletedDate(item.getCompletedDate());
        return dto;
    }
}