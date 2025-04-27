package com.example.LearningPlan.modules.plan_management.repositories;

import com.example.LearningPlan.modules.plan_management.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, String> {

    // Find all non-deleted learning plans for a specific user
    List<LearningPlan> findByUserIdAndDeleteStatusFalse(String userId);

    // Find one specific non-deleted learning plan
    Optional<LearningPlan> findByIdAndDeleteStatusFalse(String id);

    // Find one specific non-deleted learning plan owned by a specific user
    Optional<LearningPlan> findByIdAndUserIdAndDeleteStatusFalse(String id, String userId);

    // Find all non-deleted learning plans
    List<LearningPlan> findByDeleteStatusFalse();

    // Find learning plans by title containing a keyword (non-deleted only)
    List<LearningPlan> findByTitleContainingAndDeleteStatusFalse(String keyword);

    // Count learning plans by user
    Long countByUserIdAndDeleteStatusFalse(String userId);

    // Custom query to find plans containing a specific topic
    @Query("SELECT p FROM LearningPlan p JOIN p.topics t WHERE t = :topic AND p.deleteStatus = false")
    List<LearningPlan> findPlansByTopic(@Param("topic") String topic);
}