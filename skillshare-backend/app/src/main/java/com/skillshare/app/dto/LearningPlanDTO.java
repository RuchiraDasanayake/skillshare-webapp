package com.skillshare.app.dto;

import java.time.LocalDate;
import java.util.List;

public class LearningPlanDTO {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private List<LearningPlanItemDTO> items;
    private LocalDate startDate;
    private LocalDate targetCompletionDate;
    private boolean isPublic;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<LearningPlanItemDTO> getItems() { return items; }
    public void setItems(List<LearningPlanItemDTO> items) { this.items = items; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
}