package com.skillshare.app.user.util;

import com.skillshare.app.user.model.User;

public class UserUtil {
    public static final boolean isReqUser (User reqUser, User user2){
        return reqUser.getId().equals(user2.getId());
    }

    public static final boolean isFollowedByReqUser(User reqUser, User user2)
    {
        return reqUser.getFollowings().contains(user2);
    }
}
