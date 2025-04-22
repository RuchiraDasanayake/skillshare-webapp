package com.skillshare.app.user.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.skillshare.app.posts.model.Like;
import com.skillshare.app.posts.model.SkillPost;
import com.skillshare.app.user.dto.Varification;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @OneToMany
    private List<SkillPost> twits = new ArrayList<>();

    private String userId;
    private String fullName;
    private String email;
    private boolean login_with_google;
    private String password;
    private String birthDate;
    private String location; 
    private String bio;      
    private String website;  
    private String image;    
    private String background; 

    @OneToMany
    private List<Like> likes = new ArrayList<>();

    @Embedded
    private Varification verification;

    @JsonIgnore
    @ManyToMany
    private List<User> followers = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    private List<User> followings = new ArrayList<>();

}
