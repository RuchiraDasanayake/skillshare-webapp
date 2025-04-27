package com.example.LearningPlan.modules.plan_management.services;

import com.example.LearningPlan.modules.plan_management.dtos.LearningPlanDTOs;
import com.example.LearningPlan.modules.plan_management.models.LearningPlan;
import com.example.LearningPlan.modules.plan_management.repositories.LearningPlanRepository;
import com.example.LearningPlan.modules.user_management.models.AppUser;
import com.example.LearningPlan.modules.user_management.repositories.AppUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
    private final AppUserRepository userRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository, AppUserRepository userRepository) {
        this.learningPlanRepository = learningPlanRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new learning plan
     */
    @Transactional
    public LearningPlanDTOs.LearningPlanResponse createLearningPlan(
            String userId,
            LearningPlanDTOs.CreateLearningPlanRequest request) {

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setTitle(request.getTitle());
        learningPlan.setTopics(request.getTopics());
        learningPlan.setResources(request.getResources());

        // Convert DTO timeline to entity timeline
        List<LearningPlan.TopicTimeline> timeline = new ArrayList<>();
        if (request.getTimeline() != null) {
            for (LearningPlanDTOs.TopicTimelineDTO timelineDTO : request.getTimeline()) {
                LearningPlan.TopicTimeline timelineItem = new LearningPlan.TopicTimeline();
                timelineItem.setTopic(timelineDTO.getTopic());
                timelineItem.setExpectedCompletionDate(timelineDTO.getExpectedCompletionDate());
                timeline.add(timelineItem);
            }
        }
        learningPlan.setTimeline(timeline);
        learningPlan.setUser(user);

        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);

        return convertToLearningPlanResponse(savedPlan);
    }

    /**
     * Get all learning plans
     */
    public List<LearningPlanDTOs.LearningPlanSummary> getAllLearningPlans() {
        List<LearningPlan> plans = learningPlanRepository.findByDeleteStatusFalse();
        return plans.stream()
                .map(this::convertToLearningPlanSummary)
                .collect(Collectors.toList());
    }

    /**
     * Get all learning plans for a specific user
     */
    public List<LearningPlanDTOs.LearningPlanSummary> getUserLearningPlans(String userId) {
        List<LearningPlan> plans = learningPlanRepository.findByUserIdAndDeleteStatusFalse(userId);
        return plans.stream()
                .map(this::convertToLearningPlanSummary)
                .collect(Collectors.toList());
    }

    /**
     * Get learning plan details by ID
     */
    public LearningPlanDTOs.LearningPlanWithUserResponse getLearningPlanById(String planId) {
        LearningPlan plan = learningPlanRepository.findByIdAndDeleteStatusFalse(planId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found with ID: " + planId));

        return convertToLearningPlanWithUserResponse(plan);
    }

    /**
     * Get learning plan details by ID for a specific user
     */
    public LearningPlanDTOs.LearningPlanResponse getUserLearningPlanById(String userId, String planId) {
        LearningPlan plan = learningPlanRepository.findByIdAndUserIdAndDeleteStatusFalse(planId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found with ID: " + planId + " for user: " + userId));

        return convertToLearningPlanResponse(plan);
    }

    /**
     * Update a learning plan
     */
    @Transactional
    public LearningPlanDTOs.LearningPlanResponse updateLearningPlan(
            String userId,
            String planId,
            LearningPlanDTOs.UpdateLearningPlanRequest request) {

        LearningPlan existingPlan = learningPlanRepository.findByIdAndUserIdAndDeleteStatusFalse(planId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found with ID: " + planId + " for user: " + userId));

        if (request.getTitle() != null) {
            existingPlan.setTitle(request.getTitle());
        }

        if (request.getTopics() != null) {
            existingPlan.setTopics(request.getTopics());
        }

        if (request.getResources() != null) {
            existingPlan.setResources(request.getResources());
        }

        if (request.getTimeline() != null) {
            List<LearningPlan.TopicTimeline> timeline = new ArrayList<>();
            for (LearningPlanDTOs.TopicTimelineDTO timelineDTO : request.getTimeline()) {
                LearningPlan.TopicTimeline timelineItem = new LearningPlan.TopicTimeline();
                timelineItem.setTopic(timelineDTO.getTopic());
                timelineItem.setExpectedCompletionDate(timelineDTO.getExpectedCompletionDate());
                timeline.add(timelineItem);
            }
            existingPlan.setTimeline(timeline);
        }

        existingPlan.setUpdatedAt(new Date());
        LearningPlan updatedPlan = learningPlanRepository.save(existingPlan);

        return convertToLearningPlanResponse(updatedPlan);
    }

    /**
     * Soft delete a learning plan
     */
    @Transactional
    public void deleteLearningPlan(String userId, String planId) {
        LearningPlan plan = learningPlanRepository.findByIdAndUserIdAndDeleteStatusFalse(planId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found with ID: " + planId + " for user: " + userId));

        plan.setDeleteStatus(true);
        plan.setUpdatedAt(new Date());
        learningPlanRepository.save(plan);
    }

    /**
     * Hard delete a learning plan
     */
    @Transactional
    public void hardDeleteLearningPlan(String planId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found with ID: " + planId));

        learningPlanRepository.delete(plan);
    }

    /**
     * Search learning plans by title keyword
     */
    public List<LearningPlanDTOs.LearningPlanSummary> searchLearningPlansByTitle(String keyword) {
        List<LearningPlan> plans = learningPlanRepository.findByTitleContainingAndDeleteStatusFalse(keyword);
        return plans.stream()
                .map(this::convertToLearningPlanSummary)
                .collect(Collectors.toList());
    }

    /**
     * Search learning plans by topic
     */
    public List<LearningPlanDTOs.LearningPlanSummary> searchLearningPlansByTopic(String topic) {
        List<LearningPlan> plans = learningPlanRepository.findPlansByTopic(topic);
        return plans.stream()
                .map(this::convertToLearningPlanSummary)
                .collect(Collectors.toList());
    }

    // Utility methods for DTO conversion
    private LearningPlanDTOs.LearningPlanResponse convertToLearningPlanResponse(LearningPlan plan) {
        LearningPlanDTOs.LearningPlanResponse response = new LearningPlanDTOs.LearningPlanResponse();
        response.setId(plan.getId());
        response.setTitle(plan.getTitle());
        response.setTopics(plan.getTopics());
        response.setResources(plan.getResources());
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());

        // Convert timeline
        if (plan.getTimeline() != null) {
            List<LearningPlanDTOs.TopicTimelineDTO> timelineDTOs = new ArrayList<>();
            for (LearningPlan.TopicTimeline timeline : plan.getTimeline()) {
                LearningPlanDTOs.TopicTimelineDTO timelineDTO = new LearningPlanDTOs.TopicTimelineDTO();
                timelineDTO.setTopic(timeline.getTopic());
                timelineDTO.setExpectedCompletionDate(timeline.getExpectedCompletionDate());
                timelineDTOs.add(timelineDTO);
            }
            response.setTimeline(timelineDTOs);
        }

        return response;
    }

    private LearningPlanDTOs.LearningPlanWithUserResponse convertToLearningPlanWithUserResponse(LearningPlan plan) {
        LearningPlanDTOs.LearningPlanWithUserResponse response = new LearningPlanDTOs.LearningPlanWithUserResponse();
        response.setId(plan.getId());
        response.setTitle(plan.getTitle());
        response.setTopics(plan.getTopics());
        response.setResources(plan.getResources());
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());

        // Convert timeline
        if (plan.getTimeline() != null) {
            List<LearningPlanDTOs.TopicTimelineDTO> timelineDTOs = new ArrayList<>();
            for (LearningPlan.TopicTimeline timeline : plan.getTimeline()) {
                LearningPlanDTOs.TopicTimelineDTO timelineDTO = new LearningPlanDTOs.TopicTimelineDTO();
                timelineDTO.setTopic(timeline.getTopic());
                timelineDTO.setExpectedCompletionDate(timeline.getExpectedCompletionDate());
                timelineDTOs.add(timelineDTO);
            }
            response.setTimeline(timelineDTOs);
        }

        // Add owner information
        LearningPlanDTOs.PlanOwnerDTO ownerDTO = new LearningPlanDTOs.PlanOwnerDTO();
        ownerDTO.setId(plan.getUser().getId());
        ownerDTO.setFirstName(plan.getUser().getFirstName());
        ownerDTO.setLastName(plan.getUser().getLastName());
        ownerDTO.setProfileImageUrl(plan.getUser().getProfileImageUrl());
        response.setOwner(ownerDTO);

        return response;
    }

    private LearningPlanDTOs.LearningPlanSummary convertToLearningPlanSummary(LearningPlan plan) {
        LearningPlanDTOs.LearningPlanSummary summary = new LearningPlanDTOs.LearningPlanSummary();
        summary.setId(plan.getId());
        summary.setTitle(plan.getTitle());
        summary.setTopicCount(plan.getTopics() != null ? plan.getTopics().size() : 0);
        summary.setUpdatedAt(plan.getUpdatedAt());
        summary.setResources(plan.getResources());
        summary.setTopics(plan.getTopics());
      
        summary.setTimeline(  plan.getTimeline().stream().map(t -> {
            LearningPlanDTOs.TopicTimelineDTO dto = new LearningPlanDTOs.TopicTimelineDTO();
            dto.setTopic(t.getTopic());
            dto.setExpectedCompletionDate(t.getExpectedCompletionDate());
            return dto;
        }).toList());
        // Add owner information
        LearningPlanDTOs.PlanOwnerDTO ownerDTO = new LearningPlanDTOs.PlanOwnerDTO();
        ownerDTO.setId(plan.getUser().getId());
        ownerDTO.setFirstName(plan.getUser().getFirstName());
        ownerDTO.setLastName(plan.getUser().getLastName());
        ownerDTO.setProfileImageUrl(plan.getUser().getProfileImageUrl());
        summary.setOwner(ownerDTO);

        return summary;
    }
}