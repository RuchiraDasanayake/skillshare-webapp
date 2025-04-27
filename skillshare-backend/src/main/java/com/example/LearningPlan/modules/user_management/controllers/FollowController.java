package com.example.LearningPlan.modules.user_management.controllers;

import com.example.LearningPlan.modules.user_management.dtos.FollowDTOs;
import com.example.LearningPlan.modules.user_management.repositories.AppUserRepository;
import com.example.LearningPlan.modules.user_management.services.FollowService;
import com.example.LearningPlan.modules.user_management.models.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private AppUserRepository userRepository;

    // Follow a user
    @PostMapping("{userId}")
    public ResponseEntity<FollowDTOs.FollowResponse> followUser(
            @RequestBody FollowDTOs.FollowRequest request,
            @PathVariable String userId
    ) {
        AppUser currentUser = userRepository.getById(userId);
        FollowDTOs.FollowResponse response = followService.followUser(request.getFollowingId(), currentUser);
        return ResponseEntity.ok(response);
    }

    // Unfollow a user
    @DeleteMapping("/{followingId}/{userId}")
    public ResponseEntity<String> unfollowUser(
            @PathVariable String followingId,
            @PathVariable String userId
    ) {
        AppUser currentUser = userRepository.getById(userId);
        followService.unfollowUser(followingId, currentUser);
        return ResponseEntity.ok("Unfollowed successfully.");
    }

    // Get all followers of a user
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowDTOs.FollowResponse>> getFollowers(@PathVariable String userId) {
        List<FollowDTOs.FollowResponse> followers = followService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    // Get all users a user is following
    @GetMapping("/followings/{userId}")
    public ResponseEntity<List<FollowDTOs.FollowResponse>> getFollowings(@PathVariable String userId) {
        List<FollowDTOs.FollowResponse> followings = followService.getFollowings(userId);
        return ResponseEntity.ok(followings);
    }

    // Count followers for a user
    @GetMapping("/count/followers/{userId}")
    public ResponseEntity<Long> countFollowers(@PathVariable String userId) {
        long followerCount = followService.countFollowers(userId);
        return ResponseEntity.ok(followerCount);
    }

    // Count followings for a user
    @GetMapping("/count/followings/{userId}")
    public ResponseEntity<Long> countFollowings(@PathVariable String userId) {
        long followingCount = followService.countFollowings(userId);
        return ResponseEntity.ok(followingCount);
    }
}