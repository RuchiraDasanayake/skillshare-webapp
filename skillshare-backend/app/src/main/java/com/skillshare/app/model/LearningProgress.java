package com.skillshare.app.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "learning_progress")
public class LearningProgress {
    public enum ProgressType {
        COMPLETED_TUTORIAL, ONGOING_TUTORIAL, NEW_SKILL, MILESTONE
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressType type;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    private String skillsLearned;
    private LocalDate completionDate;
    private int completionPercentage;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ProgressType getType() { return type; }
    public void setType(ProgressType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSkillsLearned() { return skillsLearned; }
    public void setSkillsLearned(String skillsLearned) { this.skillsLearned = skillsLearned; }
    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }
    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
}