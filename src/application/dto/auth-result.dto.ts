export interface AuthUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: string[];
}

export interface AuthResultDto {
  user: AuthUserDto;
  accessToken: string;
  refreshToken: string;
}
