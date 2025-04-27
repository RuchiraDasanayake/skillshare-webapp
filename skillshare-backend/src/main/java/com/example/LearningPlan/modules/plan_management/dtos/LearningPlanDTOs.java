package com.example.LearningPlan.modules.plan_management.dtos;

import java.util.Date;
import java.util.List;

public class LearningPlanDTOs {

    // DTO for creating a new learning plan
    public static class CreateLearningPlanRequest {
        private String title;
        private List<String> topics;
        private List<String> resources;
        private List<TopicTimelineDTO> timeline;

        // Getters and Setters
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

        public List<TopicTimelineDTO> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TopicTimelineDTO> timeline) {
            this.timeline = timeline;
        }
    }

    // DTO for updating a learning plan
    public static class UpdateLearningPlanRequest {
        private String title;
        private List<String> topics;
        private List<String> resources;
        private List<TopicTimelineDTO> timeline;

        // Getters and Setters
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

        public List<TopicTimelineDTO> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TopicTimelineDTO> timeline) {
            this.timeline = timeline;
        }
    }

    // DTO for timeline items
    public static class TopicTimelineDTO {
        private String topic;
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

    // Basic response DTO (without user details)
    public static class LearningPlanResponse {
        private String id;
        private String title;
        private List<String> topics;
        private List<String> resources;
        private List<TopicTimelineDTO> timeline;
        private Date createdAt;
        private Date updatedAt;

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

        public List<TopicTimelineDTO> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TopicTimelineDTO> timeline) {
            this.timeline = timeline;
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

    // Detailed response DTO with user information
    public static class LearningPlanWithUserResponse {
        private String id;
        private String title;
        private List<String> topics;
        private List<String> resources;
        private List<TopicTimelineDTO> timeline;
        private Date createdAt;
        private Date updatedAt;
        private PlanOwnerDTO owner;

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

        public List<TopicTimelineDTO> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TopicTimelineDTO> timeline) {
            this.timeline = timeline;
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

        public PlanOwnerDTO getOwner() {
            return owner;
        }

        public void setOwner(PlanOwnerDTO owner) {
            this.owner = owner;
        }
    }

    // DTO for plan owner information
    public static class PlanOwnerDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String profileImageUrl;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getProfileImageUrl() {
            return profileImageUrl;
        }

        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
    }

    // DTO for listing multiple plans (summary view)
    public static class LearningPlanSummary {
        private String id;
        private String title;
        private int topicCount;
        private Date updatedAt;
        private PlanOwnerDTO owner;

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

        public List<TopicTimelineDTO> getTimeline() {
            return timeline;
        }

        public void setTimeline(List<TopicTimelineDTO> timeline) {
            this.timeline = timeline;
        }

        private List<String> topics;
        private List<String> resources;
        private List<TopicTimelineDTO> timeline;

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

        public int getTopicCount() {
            return topicCount;
        }

        public void setTopicCount(int topicCount) {
            this.topicCount = topicCount;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }

        public PlanOwnerDTO getOwner() {
            return owner;
        }

        public void setOwner(PlanOwnerDTO owner) {
            this.owner = owner;
        }
    }
}