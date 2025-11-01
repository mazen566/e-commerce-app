import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
