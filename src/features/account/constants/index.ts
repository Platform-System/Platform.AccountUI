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
  intro: string;
  avatarOriginal?: string;
  avatarCrop?: { zoom: number; x: number; y: number } | null;
  coverOriginal?: string;
  coverCrop?: { zoom: number; x: number; y: number } | null;
  introOriginal?: string;
  introCrop?: { zoom: number; x: number; y: number } | null;
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
  intro: "",
  avatarOriginal: "",
  avatarCrop: null,
  coverOriginal: "",
  coverCrop: null,
  introOriginal: "",
  introCrop: null,
};
