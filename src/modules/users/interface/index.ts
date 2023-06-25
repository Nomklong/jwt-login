import { Role } from "@module/auth/enum/roles.enum";

export interface UserUpdateParams {
  name: string;
  email?: string;
  avatar?: Express.Multer.File;
  roles?: Role[];
}
