package com.skillshare.app.posts.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostDTO {
    private String description;
    private List<MediaDTO> media;
}