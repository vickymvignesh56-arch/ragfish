import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";

export class UserRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  )
  password!: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
