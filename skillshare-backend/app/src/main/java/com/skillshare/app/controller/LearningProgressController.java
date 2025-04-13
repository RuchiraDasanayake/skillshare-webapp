package com.skillshare.app.controller;

import com.skillshare.app.dto.LearningProgressDTO;
import com.skillshare.app.service.LearningProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class LearningProgressController {
    @Autowired
    private LearningProgressService learningProgressService;
    
    @PostMapping
    public ResponseEntity<LearningProgressDTO> createProgress(@RequestBody LearningProgressDTO progressDTO) {
        LearningProgressDTO createdProgress = learningProgressService.createLearningProgress(progressDTO);
        return ResponseEntity.ok(createdProgress);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgress(@PathVariable Long userId) {
        List<LearningProgressDTO> progressList = learningProgressService.getUserProgress(userId);
        return ResponseEntity.ok(progressList);
    }
    
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgressByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        List<LearningProgressDTO> progressList = learningProgressService.getUserProgressByType(userId, type);
        return ResponseEntity.ok(progressList);
    }
    
    @PostMapping("/new-skill")
    public ResponseEntity<LearningProgressDTO> addNewSkill(
            @RequestParam Long userId,
            @RequestParam String skillName,
            @RequestParam String description) {
        LearningProgressDTO progress = learningProgressService.addNewSkill(userId, skillName, description);
        return ResponseEntity.ok(progress);
    }
    
    @PostMapping("/milestone")
    public ResponseEntity<LearningProgressDTO> addMilestone(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String skills) {
        LearningProgressDTO progress = learningProgressService.addMilestone(userId, title, description, skills);
        return ResponseEntity.ok(progress);
    }
}