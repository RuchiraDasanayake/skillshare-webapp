package com.skillshare.app.posts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillshare.app.posts.model.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

}
