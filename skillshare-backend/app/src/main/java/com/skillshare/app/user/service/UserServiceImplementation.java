package com.skillshare.app.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillshare.app.config.JwtProvider;
import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;
import com.skillshare.app.user.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;
    private JwtProvider jwtProvider;

    // Implement the methods defined in UserService interface
    @Override
    public User findUserById(Long userid) throws UserException {
        User user = userRepository.findById(userid).orElseThrow(()-> new UserException("User not found with id: " + userid));
        return user;
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = jwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User updateUser(Long userid, User req) throws UserException {
        User user = findUserById(userid);

        if (req.getFullName() != null) {
            user.setFullName(req.getFullName());
        }
        if (req.getImage() != null) {
            user.setImage(req.getImage());
        }
        if (req.getBackground() != null) {
            user.setBackground(req.getBackground());
        }
        if (req.getBirthDate() != null) {
            user.setBirthDate(req.getBirthDate());
        }
        if (req.getLocation() != null) {
            user.setLocation(req.getLocation());
        }
        if (req.getBio() != null) {
            user.setBio(req.getBio());
        }
        if (req.getWebsite() != null) {
            user.setWebsite(req.getWebsite());
        }


        return userRepository.save(user);
    }

    @Override
    public User followUser(Long userid, User user) throws UserException {
        User followToUser = findUserById(userid);

        if (user.getFollowings().contains(followToUser) && followToUser.getFollowers().contains(user)) {
            user.getFollowings().remove(followToUser);
            followToUser.getFollowers().remove(user);
        }
        else{
            user.getFollowings().add(followToUser);
            followToUser.getFollowers().add(user);
        }
        
        userRepository.save(followToUser);
        userRepository.save(user);
        return followToUser;
    }

    @Override
    public List<User> searchUser(String query) {
        
        return userRepository.searchUser(query);
    }

}
