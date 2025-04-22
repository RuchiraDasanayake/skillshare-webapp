package com.skillshare.app.user.util;

import java.util.ArrayList;
import java.util.List;

import com.skillshare.app.user.dto.UserDto;
import com.skillshare.app.user.model.User;

public class UserDtoMapper {
    public static UserDto toUserDto(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFullName(user.getFullName());
        userDto.setLocation(user.getLocation());
        userDto.setBirthDate(user.getBirthDate());
        userDto.setEmail(user.getEmail());
        userDto.setImage(user.getImage());
        userDto.setBackgroundImage(user.getBackground());
        userDto.setBio(user.getBio());
        userDto.setFollowers(toUserDtos(user.getFollowers()));
        userDto.setFollowings(toUserDtos(user.getFollowings()));
        userDto.setLogin_with_google(user.isLogin_with_google());
        //userDto.setVerified(false);

        return userDto;
    }

    public static List<UserDto> toUserDtos(List<User> followers) {
        List<UserDto> userDtos = new ArrayList<>();
        for (User user : followers) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setFullName(user.getFullName());
            userDto.setEmail(user.getEmail());
            userDto.setImage(user.getImage());
            userDtos.add(userDto);
        }
        return userDtos;
    }
}   
