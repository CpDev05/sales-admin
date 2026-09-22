export const TOKEN_PORT = Symbol('TOKEN_PORT');

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPort {
  signAccessToken(payload: TokenPayload): Promise<string>;
  signRefreshToken(payload: TokenPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
}
