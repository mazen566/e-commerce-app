import { Category, CategoryRepository, categorySchema } from '@models/index';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/*';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryFactoryService } from './factory';

@Module({
  imports: [
    UserMongoModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    CategoryFactoryService,
    JwtService,
  ],
})
export class CategoryModule {}
