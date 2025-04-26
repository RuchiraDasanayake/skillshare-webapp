export type CreateUserRequest = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    contactNumber: string;
    password: string;
    bio: string;
    profileImageUrl: string;
    gender: string;
    address: string;
    birthday: string;
    publicStatus: boolean;
    deactivateStatus: boolean;
    deactivateStartDate: string | null;
    deactivateEndDate: string | null;
};

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    bio: string | null;
    profileImageUrl: string | null;
    username: string;
    email: string;
    contactNumber: string | null;
    publicStatus: boolean;
    createdAt: string;
    gender: string | null;
    address: string | null;
    birthday: string | null;
};

export type LoginUserRequest = {
    username: string;
    password: string;
};

export type LoginUserResponse = {
    token: string;
    userId: string;
};
  