package com.example.LearningPlan.modules.plan_management.controllers;

import com.example.LearningPlan.modules.plan_management.dtos.LearningPlanDTOs;
import com.example.LearningPlan.modules.plan_management.services.LearningPlanService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "*") // Enable CORS for all origins
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    /**
     * Create a new learning plan
     */
    @PostMapping
    public ResponseEntity<?> createLearningPlan(
            @RequestParam String userId,
            @RequestBody LearningPlanDTOs.CreateLearningPlanRequest request) {
        try {
            LearningPlanDTOs.LearningPlanResponse response = learningPlanService.createLearningPlan(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all learning plans
     */
    @GetMapping
    public ResponseEntity<?> getAllLearningPlans() {
        try {
            List<LearningPlanDTOs.LearningPlanSummary> plans = learningPlanService.getAllLearningPlans();
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all learning plans for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLearningPlans(@PathVariable String userId) {
        try {
            List<LearningPlanDTOs.LearningPlanSummary> plans = learningPlanService.getUserLearningPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get learning plan details by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<?> getLearningPlanById(@PathVariable String planId) {
        try {
            LearningPlanDTOs.LearningPlanWithUserResponse plan = learningPlanService.getLearningPlanById(planId);
            return ResponseEntity.ok(plan);
        } catch (EntityNotFoundException e) {
            return createErrorResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get learning plan details by ID for a specific user
     */
    @GetMapping("/user/{userId}/plan/{planId}")
    public ResponseEntity<?> getUserLearningPlanById(
            @PathVariable String userId,
            @PathVariable String planId) {
        try {
            LearningPlanDTOs.LearningPlanResponse plan = learningPlanService.getUserLearningPlanById(userId, planId);
            return ResponseEntity.ok(plan);
        } catch (EntityNotFoundException e) {
            return createErrorResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a learning plan
     */
    @PutMapping("/{planId}")
    public ResponseEntity<?> updateLearningPlan(
            @RequestParam String userId,
            @PathVariable String planId,
            @RequestBody LearningPlanDTOs.UpdateLearningPlanRequest request) {
        try {
            LearningPlanDTOs.LearningPlanResponse response = learningPlanService.updateLearningPlan(userId, planId, request);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return createErrorResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Delete a learning plan (soft delete)
     */
    @DeleteMapping("/{planId}")
    public ResponseEntity<?> deleteLearningPlan(
            @RequestParam String userId,
            @PathVariable String planId) {
        try {
            learningPlanService.deleteLearningPlan(userId, planId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Learning plan deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return createErrorResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Hard delete a learning plan
     */
    @DeleteMapping("/{planId}/hard-delete")
    public ResponseEntity<?> hardDeleteLearningPlan(@PathVariable String planId) {
        try {
            learningPlanService.hardDeleteLearningPlan(planId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Learning plan permanently deleted");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return createErrorResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Search learning plans by title
     */
    @GetMapping("/search/title")
    public ResponseEntity<?> searchPlansByTitle(@RequestParam String keyword) {
        try {
            List<LearningPlanDTOs.LearningPlanSummary> plans = learningPlanService.searchLearningPlansByTitle(keyword);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Search learning plans by topic
     */
    @GetMapping("/search/topic")
    public ResponseEntity<?> searchPlansByTopic(@RequestParam String topic) {
        try {
            List<LearningPlanDTOs.LearningPlanSummary> plans = learningPlanService.searchLearningPlansByTopic(topic);
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return createErrorResponse(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create standardized error response
     */
    private ResponseEntity<?> createErrorResponse(Exception e, HttpStatus status) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.status(status).body(errorResponse);
    }
}