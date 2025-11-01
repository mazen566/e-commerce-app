import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDTO,
  LoginDTO,
  RegisterDto,
  ResetPasswordDTO,
  VerifyAccountDTO,
} from './dto';
import { AuthFactoryService } from './factory';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService,
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const customer = await this.authFactoryService.createCustomer(registerDto);
    const createdCustomer = await this.authService.register(customer);
    return {
      message: 'Customer registered successfully',
      success: true,
      data: createdCustomer,
    };
  }

  @Post('/verify-account')
  async verifyAccount(@Body() verifyAccountDTO: VerifyAccountDTO) {
    await this.authService.verifyAccount(verifyAccountDTO);
    return {
      message: 'Account verified successfully',
      success: true,
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDTO) {
    const token = await this.authService.login(loginDto);
    return {
      message: 'Customer logged in successfully',
      success: true,
      data: { token },
    };
  }

  @Patch('/forget-password')
  async forgetPassword(@Body() forgetPasswordDTO: ForgetPasswordDTO) {
    await this.authService.forgetPassword(forgetPasswordDTO);
    return {
      message: 'OTP sent to your email successfully',
      success: true,
    };
  }

  @Patch('/reset-password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    await this.authService.resetPassword(resetPasswordDTO);
    return {
      message: 'Password reset successfully',
      success: true,
    };
  }
}
