import { generateOtp } from '@common/helpers';
import { RegisterDto } from '../dto';
import { Customer } from '../entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthFactoryService {
  async createCustomer(registerDto: RegisterDto) {
    const customer = new Customer();
    customer.email = registerDto.email;
    customer.userName = registerDto.userName;
    customer.password = await bcrypt.hash(registerDto.password, 10);
    customer.otp = generateOtp();
    customer.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    customer.isVerified = false;
    customer.dob = registerDto.dob;
    return customer;
  }
}
