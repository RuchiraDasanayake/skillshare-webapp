package com.skillshare.app.posts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillshare.app.posts.model.SkillPost;

@Repository
public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    List<SkillPost> findByUserId(String userId);
    List<SkillPost> findBySkillCategory(String skillCategory);
}