package com.example.LearningPlan.modules.user_management.services;

import com.example.LearningPlan.modules.user_management.models.Follow;
import com.example.LearningPlan.modules.user_management.models.AppUser;
import com.example.LearningPlan.modules.user_management.repositories.FollowRepository;
import com.example.LearningPlan.modules.user_management.dtos.FollowDTOs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    // Follow a user
    public FollowDTOs.FollowResponse followUser(String followingId, AppUser currentUser) {
        if (followRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), followingId)) {
            throw new IllegalArgumentException("You are already following this user.");
        }

        Follow follow = new Follow();
        follow.setFollower(currentUser);
        follow.setFollowing(new AppUser());
        follow.getFollowing().setId(followingId);
        follow.setCreatedAt(new Date());

        Follow savedFollow = followRepository.save(follow);
        return mapToFollowResponse(savedFollow);
    }

    // Unfollow a user
    @Transactional
    public void unfollowUser(String followingId, AppUser currentUser) {
        if (!followRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), followingId)) {
            throw new IllegalArgumentException("You are not following this user.");
        }

        followRepository.deleteByFollowerIdAndFollowingId(currentUser.getId(), followingId);
    }

    // Get all followers of a user
    public List<FollowDTOs.FollowResponse> getFollowers(String userId) {
        List<Follow> followers = followRepository.findByFollowingId(userId);
        return followers.stream()
                .map(this::mapToFollowResponse)
                .collect(Collectors.toList());
    }

    // Get all users a user is following
    public List<FollowDTOs.FollowResponse> getFollowings(String userId) {
        List<Follow> followings = followRepository.findByFollowerId(userId);
        return followings.stream()
                .map(this::mapToFollowResponse)
                .collect(Collectors.toList());
    }

    // Count followers for a user
    public long countFollowers(String userId) {
        return followRepository.countByFollowingId(userId);
    }

    // Count followings for a user
    public long countFollowings(String userId) {
        return followRepository.countByFollowerId(userId);
    }

    // Map Follow entity to FollowResponse DTO
    private FollowDTOs.FollowResponse mapToFollowResponse(Follow follow) {
        FollowDTOs.FollowResponse response = new FollowDTOs.FollowResponse();
        response.setId(follow.getId());
        response.setCreatedAt(follow.getCreatedAt());

        FollowDTOs.UserSummaryDTO followerSummary = new FollowDTOs.UserSummaryDTO();
        followerSummary.setId(follow.getFollower().getId());
        followerSummary.setFirstName(follow.getFollower().getFirstName());
        followerSummary.setLastName(follow.getFollower().getLastName());
        followerSummary.setProfileImageUrl(follow.getFollower().getProfileImageUrl());
        response.setFollower(followerSummary);

        FollowDTOs.UserSummaryDTO followingSummary = new FollowDTOs.UserSummaryDTO();
        followingSummary.setId(follow.getFollowing().getId());
        followingSummary.setFirstName(follow.getFollowing().getFirstName());
        followingSummary.setLastName(follow.getFollowing().getLastName());
        followingSummary.setProfileImageUrl(follow.getFollowing().getProfileImageUrl());
        response.setFollowing(followingSummary);

        return response;
    }
}