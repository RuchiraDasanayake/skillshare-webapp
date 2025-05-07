package com.skillshare.app.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillshare.app.config.TokenProvider;
import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;
import com.skillshare.app.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("User not found with id: " + userId);
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = tokenProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User updateUser(Long userId, User req) throws UserException {
        User user = findUserById(userId);
        
        // Update only non-null fields
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getLocation() != null) user.setLocation(req.getLocation());
        if (req.getWebsite() != null) user.setWebsite(req.getWebsite());
        if (req.getBirthDate() != null) user.setBirthDate(req.getBirthDate());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getImage() != null) user.setImage(req.getImage());
        if (req.getBackground() != null) user.setBackground(req.getBackground());
        
        return userRepository.save(user);
    }

    @Override
    public User followUser(Long userId, User reqUser) throws UserException {
        User targetUser = findUserById(userId);
        
        // Check if target user is the same as requesting user
        if (targetUser.getId().equals(reqUser.getId())) {
            throw new UserException("You cannot follow yourself");
        }
        
        // Follow or unfollow based on current state
        boolean isFollowing = targetUser.getFollowers().contains(reqUser);
        
        if (isFollowing) {
            // Unfollow
            targetUser.getFollowers().remove(reqUser);
            reqUser.getFollowings().remove(targetUser);
        } else {
            // Follow
            targetUser.getFollowers().add(reqUser);
            reqUser.getFollowings().add(targetUser);
        }
        
        // Save both users
        userRepository.save(reqUser);
        userRepository.save(targetUser);
        
        return targetUser;
    }

    @Override
    public List<User> searchUser(String query) {
        return userRepository.findByFullNameContainingIgnoreCase(query);
    }
}