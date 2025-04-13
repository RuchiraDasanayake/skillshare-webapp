package com.skillshare.app.controller;

import com.skillshare.app.dto.LearningProgressDTO;
import com.skillshare.app.service.LearningProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class LearningProgressController {
    private final LearningProgressService progressService;

    public LearningProgressController(LearningProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    public ResponseEntity<LearningProgressDTO> createProgress(@RequestBody LearningProgressDTO progressDTO) {
        LearningProgressDTO createdProgress = progressService.createProgress(progressDTO);
        return ResponseEntity.ok(createdProgress);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgress(@PathVariable Long userId) {
        List<LearningProgressDTO> progressList = progressService.getUserProgress(userId);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgressByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        List<LearningProgressDTO> progressList = progressService.getUserProgressByType(userId, type);
        return ResponseEntity.ok(progressList);
    }
}