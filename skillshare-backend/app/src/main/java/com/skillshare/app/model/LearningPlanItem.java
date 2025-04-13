package com.skillshare.app.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "learning_plan_items")
public class LearningPlanItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private LearningPlan learningPlan;
    
    private String title;
    private String description;
    private String resourceUrl;
    private int completionPercentage;
    private boolean isCompleted;
    private LocalDate completedDate;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LearningPlan getLearningPlan() { return learningPlan; }
    public void setLearningPlan(LearningPlan learningPlan) { this.learningPlan = learningPlan; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getResourceUrl() { return resourceUrl; }
    public void setResourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; }
    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }
}