import { Role } from "@module/auth/enum/roles.enum";

export interface RegisterParams {
  email: string;
  name: string;
  roles?: Role[];
  password: string;
  mobile?: string;
  address?: string;
}

export interface JwtPayload {
  jti: string;
  iat: number;
  exp: number;
}
