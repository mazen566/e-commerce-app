import { Module } from '@nestjs/common';
import { UserMongoModule } from '@shared/*';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFactoryService } from './factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserMongoModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, JwtService],
})
export class AuthModule {}
