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
        return ResponseEntity.ok(progressService.createProgress(progressDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getUserProgress(userId));
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<LearningProgressDTO>> getUserProgressByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        return ResponseEntity.ok(progressService.getUserProgressByType(userId, type));
    }

    @PutMapping("/{id}/summary")
    public ResponseEntity<Void> updateSummary(@PathVariable Long id, @RequestBody String summary) {
        progressService.updateSummary(id, summary);
        return ResponseEntity.ok().build();
    }
}
