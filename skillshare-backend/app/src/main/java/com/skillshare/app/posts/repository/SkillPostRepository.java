package com.skillshare.app.posts.repository;

import com.skillshare.app.posts.model.SkillPost;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    List<SkillPost> findByUserId(String userId);
    List<SkillPost> findBySkillCategory(String skillCategory);
}