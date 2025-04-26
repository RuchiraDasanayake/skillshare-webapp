package com.skillshare.app.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillshare.app.user.dto.UserDto;
import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;
import com.skillshare.app.user.service.UserService;
import com.skillshare.app.user.util.UserDtoMapper;
import com.skillshare.app.user.util.UserUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(@RequestHeader("Authorization") String token) throws UserException {
        // Extract user ID from the token
        User user= userService.findUserProfileByJwt(token);
        
        // Fetch user profile
        UserDto userDto = UserDtoMapper.toUserDto(user);
        userDto.setReq_user(true);

        
        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{userid}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userid, @RequestHeader("Authorization") String token) throws UserException {
        // Extract user ID from the token
        User reqUser= userService.findUserProfileByJwt(token);

        User user = userService.findUserById(userid);
        
        // Fetch user profile
        UserDto userDto = UserDtoMapper.toUserDto(user);
        userDto.setReq_user(UserUtil.isReqUser(reqUser, user));
        userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));

        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUser(@RequestParam String query, @RequestHeader("Authorization") String token) throws UserException {
        // Extract user ID from the token
        User reqUser= userService.findUserProfileByJwt(token);

        List<User> user = userService.searchUser(query);
        
        // Fetch user profile
        List<UserDto> userDtos = UserDtoMapper.toUserDtos(user);
        
        return new ResponseEntity<>(userDtos, HttpStatus.ACCEPTED);
    }

    @PutMapping("/update")
    public ResponseEntity<UserDto> searchUser(@RequestBody User req, @RequestHeader("Authorization") String token) throws UserException {
        // Extract user ID from the token
        User reqUser= userService.findUserProfileByJwt(token);

        User user = userService.updateUser(reqUser.getId(), req);
        
        // Fetch user profile
        UserDto userDtos = UserDtoMapper.toUserDto(user);
        
        return new ResponseEntity<>(userDtos, HttpStatus.ACCEPTED);
    }

    @PutMapping("/{userid}/follow")
    public ResponseEntity<UserDto> searchUser(@PathVariable Long userid, @RequestHeader("Authorization") String token) throws UserException {
        // Extract user ID from the token
        User reqUser= userService.findUserProfileByJwt(token);

        User user = userService.followUser(userid, reqUser);
        UserDto userDto = UserDtoMapper.toUserDto(user);
        userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));

        
        // Fetch user profile
        UserDto userDtos = UserDtoMapper.toUserDto(user);
        
        return new ResponseEntity<>(userDtos, HttpStatus.ACCEPTED);
    }


}
