package com.example.LearningPlan.modules.user_management.repositories;

import com.example.LearningPlan.modules.user_management.models.Follow;
import com.example.LearningPlan.modules.user_management.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, String> {

    // Check if a user is following another user
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);

    // Find all followers of a user
    List<Follow> findByFollowingId(String followingId);

    // Find all users a user is following
    List<Follow> findByFollowerId(String followerId);

    // Delete a follow relationship
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);

    // Count followers for a user
    long countByFollowingId(String followingId);

    // Count followings for a user
    long countByFollowerId(String followerId);


}