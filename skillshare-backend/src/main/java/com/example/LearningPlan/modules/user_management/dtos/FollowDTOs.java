package com.example.LearningPlan.modules.user_management.dtos;

import java.util.Date;

public class FollowDTOs {

    // Response DTO for a follow relationship
    public static class FollowResponse {
        private String id;
        private UserSummaryDTO follower;
        private UserSummaryDTO following;
        private Date createdAt;

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public UserSummaryDTO getFollower() {
            return follower;
        }

        public void setFollower(UserSummaryDTO follower) {
            this.follower = follower;
        }

        public UserSummaryDTO getFollowing() {
            return following;
        }

        public void setFollowing(UserSummaryDTO following) {
            this.following = following;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }

    // Request DTO for creating a follow relationship
    public static class FollowRequest {
        private String followingId;

        // Getters and Setters
        public String getFollowingId() {
            return followingId;
        }

        public void setFollowingId(String followingId) {
            this.followingId = followingId;
        }
    }

    // User summary DTO
    public static class UserSummaryDTO {
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
}