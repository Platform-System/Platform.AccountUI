export interface AccountProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  displayName: string;
  bio: string;
  location: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  cover: string;
}

export const DEFAULT_PROFILE: AccountProfile = {
  name: "",
  email: "",
  avatar: "",
  joinedDate: "",
  displayName: "",
  bio: "",
  location: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  cover: "",
};
