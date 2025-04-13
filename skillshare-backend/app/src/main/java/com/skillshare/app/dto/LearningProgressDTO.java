package com.skillshare.app.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LearningProgressDTO {
    private Long id;
    private Long userId;
    private String type;
    private String title;
    private String description;
    private String skillsLearned;
    private LocalDate completionDate;
    private int completionPercentage;
}