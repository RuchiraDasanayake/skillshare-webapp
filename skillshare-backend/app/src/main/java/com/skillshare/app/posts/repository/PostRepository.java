package com.skillshare.app.posts.repository;

import com.skillshare.app.posts.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId); // Custom method to find posts by user ID
}