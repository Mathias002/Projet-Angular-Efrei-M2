export interface UserInfos {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoleRequest {
  username?: string;
  email?: string;
  role: string;
}
