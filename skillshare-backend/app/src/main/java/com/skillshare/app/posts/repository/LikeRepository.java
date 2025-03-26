package com.skillshare.app.posts.repository;

import com.skillshare.app.posts.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndPostId(String userId, Long postId);
    int countByPostId(Long postId);
}