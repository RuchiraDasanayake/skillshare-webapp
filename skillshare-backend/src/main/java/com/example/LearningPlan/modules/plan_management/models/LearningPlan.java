package com.example.LearningPlan.modules.plan_management.models;

import com.example.LearningPlan.modules.user_management.models.AppUser;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String title;

    @ElementCollection
    @CollectionTable(name = "learning_plan_topics", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "topic")
    private List<String> topics;

    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "resource_url")
    private List<String> resources;

    @ElementCollection
    @CollectionTable(name = "learning_plan_timeline", joinColumns = @JoinColumn(name = "plan_id"))
    private List<TopicTimeline> timeline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean deleteStatus;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deleteStatus = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    // Embedded class for timeline items
    @Embeddable
    public static class TopicTimeline {
        private String topic;

        @Temporal(TemporalType.DATE)
        private Date expectedCompletionDate;

        // Getters and Setters
        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public Date getExpectedCompletionDate() {
            return expectedCompletionDate;
        }

        public void setExpectedCompletionDate(Date expectedCompletionDate) {
            this.expectedCompletionDate = expectedCompletionDate;
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public List<TopicTimeline> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<TopicTimeline> timeline) {
        this.timeline = timeline;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
