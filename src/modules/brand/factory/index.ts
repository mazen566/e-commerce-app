import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from './../dto/create-brand.dto';

@Injectable()
export class BrandFactoryService {
  createBrand(createBrandDto: CreateBrandDto, user: any) {
    const brand = new Brand();
    brand.name = createBrandDto.name;
    brand.slug = slugify(createBrandDto.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
    brand.createdBy = user._id;
    brand.updatedBy = user._id;
    brand.logo = createBrandDto.logo;
    return brand;
  }
}
