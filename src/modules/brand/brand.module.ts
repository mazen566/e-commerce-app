import { Brand, BrandRepository, brandSchema } from '@models/index';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/index';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandFactoryService } from './factory';

@Module({
  imports: [
    UserMongoModule,
    MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandFactoryService, BrandRepository],
})
export class BrandModule {}
