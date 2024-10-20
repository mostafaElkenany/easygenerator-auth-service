import { IsEmail, IsNotEmpty, IsString, isString, Matches, MinLength } from 'class-validator'

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least 1 letter, 1 number, and 1 special character.',
  })
  password: string;
}
