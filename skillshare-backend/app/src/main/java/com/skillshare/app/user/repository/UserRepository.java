package com.skillshare.app.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.skillshare.app.posts.model.SkillPost;
import com.skillshare.app.user.model.User;

@Repository
public interface  UserRepository extends JpaRepository<User, Long>{

    public User findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u WHERE u.fullName LIKE %:query% OR u.email LIKE %:query%")
    public List <User> searchUser(@Param("query") String query);

    List<SkillPost> findByUserId(String userId);
  

}
