package com.skillshare.app.posts.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileUrl; // URL of media file
    private String fileType; // Type of media (e.g., image, video)

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}