import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMongoModule } from '@shared/*';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [UserMongoModule],
  controllers: [CustomerController],
  providers: [CustomerService, JwtService],
})
export class CustomerModule {}
