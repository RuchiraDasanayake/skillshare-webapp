package com.skillshare.app.repository;

import com.skillshare.app.model.LearningProgress;
import com.skillshare.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {
    List<LearningProgress> findByUser(User user);
    List<LearningProgress> findByUserAndSkill(User user, String skill);
}