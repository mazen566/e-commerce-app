import { generateOtp, sendMail } from '@common/helpers';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ForgetPasswordDTO,
  LoginDTO,
  VerifyAccountDTO,
  ResetPasswordDTO,
} from './dto';
import { Customer } from './entities/auth.entity';
import { UserRepository, CustomerRepository } from '@models/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(customer: Customer) {
    const customerExists = await this.customerRepository.getOne({
      email: customer.email,
    });
    if (customerExists) throw new ConflictException('Customer already exists');
    const createdCustomer = await this.customerRepository.create(customer);
    await sendMail({
      to: customer.email,
      subject: 'Welcome to Our E-commerce Platform',
      html: `<h1>your otp is ${customer.otp}</h1>`,
    });
    const { password, otp, otpExpiry, ...customerObj } = JSON.parse(
      JSON.stringify(createdCustomer),
    );
    return customerObj as Customer;
  }

  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    const customer = await this.customerRepository.getOne({
      email: verifyAccountDTO.email,
    });
    if (!customer) throw new UnauthorizedException('Invalid credentials');
    if (customer.isVerified)
      throw new ConflictException('Account already verified');
    if (customer.otp !== verifyAccountDTO.otp)
      throw new UnauthorizedException('Invalid OTP');
    if (customer.otpExpiry! < new Date())
      throw new UnauthorizedException('OTP has expired');
    await this.customerRepository.updateOne(
      { email: verifyAccountDTO.email },
      { isVerified: true, $unset: { otp: '', otpExpiry: '' } },
    );
  }

  async login(loginDto: LoginDTO) {
    const customerExist = await this.userRepository.getOne({
      email: loginDto.email,
    });
    if (customerExist?.isVerified === false)
      throw new UnauthorizedException('Please verify your account first');
    const match = await bcrypt.compare(
      loginDto.password,
      customerExist?.password || '',
    );
    if (!customerExist) throw new UnauthorizedException('Invalid credentials');
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign(
      {
        _id: customerExist._id,
        role: 'customer',
        email: customerExist.email,
      },
      {
        secret: this.configService.get('access').JWT_SECRET,
        expiresIn: '1d',
      },
    );
    return token;
  }

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
    const customerExist = await this.customerRepository.getOne({
      email: forgetPasswordDTO.email,
    });
    if (!customerExist) throw new UnauthorizedException('Invalid credentials');
    const otp = generateOtp();
    await this.customerRepository.updateOne(
      { email: forgetPasswordDTO.email },
      { $set: { otp } },
    );
    await sendMail({
      to: forgetPasswordDTO.email,
      subject: 'Password Reset OTP',
      html: `<h1>Your password reset OTP is ${otp}</h1>`,
    });
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const customerExist = await this.customerRepository.getOne({
      email: resetPasswordDTO.email,
    });
    if (!customerExist) throw new UnauthorizedException('Invalid credentials');
    if (resetPasswordDTO.newPassword !== resetPasswordDTO.confirmPassword)
      throw new ConflictException('Passwords do not match');
    if (customerExist.otp !== resetPasswordDTO.otp)
      throw new UnauthorizedException('Invalid OTP');
    const hashedPassword = await bcrypt.hash(resetPasswordDTO.newPassword, 10);
    await this.customerRepository.updateOne(
      { email: resetPasswordDTO.email },
      { password: hashedPassword, $unset: { otp: '' } },
    );
  }
}
