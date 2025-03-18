package com.skillshare.app.posts.service;

import com.skillshare.app.posts.dto.PostDTO;
import com.skillshare.app.posts.model.Media;
import com.skillshare.app.posts.model.Post;
import com.skillshare.app.posts.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(PostDTO postDTO, Long userId) {
        Post post = new Post();
        post.setDescription(postDTO.getDescription());
        post.setUserId(userId);

        List<Media> media = postDTO.getMedia().stream()
            .map(mediaDTO -> {
                Media mediaEntity = new Media();
                mediaEntity.setFileUrl(mediaDTO.getFileUrl());
                mediaEntity.setFileType(mediaDTO.getFileType());
                return mediaEntity;
            })
            .collect(Collectors.toList());

        post.setMedia(media);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post updatePost(Long id, PostDTO postDTO) {
        Post post = getPostById(id);
        post.setDescription(postDTO.getDescription());

        List<Media> media = postDTO.getMedia().stream()
            .map(mediaDTO -> {
                Media mediaEntity = new Media();
                mediaEntity.setFileUrl(mediaDTO.getFileUrl());
                mediaEntity.setFileType(mediaDTO.getFileType());
                return mediaEntity;
            })
            .collect(Collectors.toList());

        post.setMedia(media);
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}