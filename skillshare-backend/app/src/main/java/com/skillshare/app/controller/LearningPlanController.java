package com.skillshare.app.controller;

import com.skillshare.app.dto.LearningPlanDTO;
import com.skillshare.app.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {
    @Autowired
    private LearningPlanService learningPlanService;
    
    @PostMapping
    public ResponseEntity<LearningPlanDTO> createLearningPlan(@RequestBody LearningPlanDTO planDTO) {
        LearningPlanDTO createdPlan = learningPlanService.createLearningPlan(planDTO);
        return ResponseEntity.ok(createdPlan);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlanDTO>> getUserLearningPlans(@PathVariable Long userId) {
        List<LearningPlanDTO> plans = learningPlanService.getUserLearningPlans(userId);
        return ResponseEntity.ok(plans);
    }
    
    @PutMapping("/items/{itemId}/progress")
    public ResponseEntity<LearningPlanDTO> updatePlanItemProgress(
            @PathVariable Long itemId,
            @RequestParam int completion,
            @RequestParam boolean completed) {
        LearningPlanDTO updatedPlan = learningPlanService.updatePlanItemProgress(itemId, completion, completed);
        return ResponseEntity.ok(updatedPlan);
    }
}