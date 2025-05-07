package com.skillshare.app.posts.assembler;

import com.skillshare.app.posts.controller.SkillPostController;
import com.skillshare.app.posts.dto.SkillPostDto;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class SkillPostModelAssembler implements RepresentationModelAssembler<SkillPostDto, EntityModel<SkillPostDto>> {

    @Override
    @NonNull
    public EntityModel<SkillPostDto> toModel(@NonNull SkillPostDto postDto) {
        // Create basic links that should always be present
        EntityModel<SkillPostDto> model = EntityModel.of(postDto,
                linkTo(methodOn(SkillPostController.class).getPostById(postDto.getId())).withSelfRel(),
                linkTo(methodOn(SkillPostController.class).getAllPosts(null)).withRel("all-posts"),
                linkTo(methodOn(SkillPostController.class).getPostComments(postDto.getId())).withRel("comments"),
                linkTo(methodOn(SkillPostController.class).getLikeCount(postDto.getId())).withRel("like-count"));

        // Add conditional links if needed
        model.add(linkTo(methodOn(SkillPostController.class).updatePost(postDto.getId(), postDto)).withRel("update"));
        model.add(linkTo(methodOn(SkillPostController.class).deletePost(postDto.getId())).withRel("delete"));

        return model;
    }

    @NonNull
    public EntityModel<SkillPostDto> toModelWithUserContext(@NonNull SkillPostDto postDto, @NonNull String userId) {
        EntityModel<SkillPostDto> model = toModel(postDto);
        
        // Check if user has liked the post by comparing userId with likeDtos
        boolean hasLiked = postDto.getLikes().stream()
                .anyMatch(like -> userId.equals(like.getUserId()));
        
        model.add(linkTo(methodOn(SkillPostController.class)
                .hasUserLikedPost(postDto.getId(), userId))
                .withRel("check-like"));
        
        model.add(hasLiked ?
                linkTo(methodOn(SkillPostController.class)
                        .unlikePost(postDto.getId(), userId))
                        .withRel("unlike") :
                linkTo(methodOn(SkillPostController.class)
                        .likePost(postDto.getId(), userId))
                        .withRel("like"));

        return model;
    }
}