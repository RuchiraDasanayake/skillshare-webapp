package com.skillshare.app.user.service;

import java.util.List;

import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;

public interface  UserService {


    public User findUserById(Long userid) throws UserException;
    public User findUserProfileByJwt(String jwt) throws UserException;

    public User updateUser(Long userid, User user) throws UserException;

    public User followUser(Long userid, User user) throws UserException;
    public List<User> searchUser(String query);


}
