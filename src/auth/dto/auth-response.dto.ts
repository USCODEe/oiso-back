export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
  user: {
    id: number;
    email: string;
    roles?: string[];
  };
}
