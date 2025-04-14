package com.skillshare.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_plan_item")
public class LearningPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_plan_id", nullable = false)
    private LearningPlan learningPlan;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LearningPlan getLearningPlan() { return learningPlan; }
    public void setLearningPlan(LearningPlan learningPlan) { this.learningPlan = learningPlan; }
}
