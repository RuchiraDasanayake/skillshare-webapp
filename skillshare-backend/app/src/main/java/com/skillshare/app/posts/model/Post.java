package com.skillshare.app.posts.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "post_id")
    private List<Media> media;

    private Long userId; 
}