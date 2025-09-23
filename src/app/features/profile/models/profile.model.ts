export interface updateUserRequest {
  username: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface updateUserResponse {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  deletedAt: string;
  createdAt: string;
  updatedAr: string;
}
