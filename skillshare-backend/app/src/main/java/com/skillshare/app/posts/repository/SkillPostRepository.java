package com.skillshare.app.posts.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillshare.app.posts.model.SkillPost;

@Repository
public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    List<SkillPost> findByUserId(Long userId);
    Page<SkillPost> findByUserId(Long userId, Pageable pageable);
    List<SkillPost> findBySkillCategory(String skillCategory);
    Optional<SkillPost> findByIdAndUserId(Long id, Long userId);
}