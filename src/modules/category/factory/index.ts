import { CategoryRepository } from './../../../models/category/category.repository';
import slugify from 'slugify';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './../dto/create-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryFactoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  createCategory(createCategoryDto: CreateCategoryDto, user: any) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.slug = slugify(createCategoryDto.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
    category.createdBy = user._id;
    category.updatedBy = user._id;
    category.logo = createCategoryDto.logo;
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: any,
  ) {
    const oldCategory = (await this.categoryRepository.getOne({
      _id: id,
    })) as Category;
    if (!oldCategory) throw new NotFoundException('Category not found');
    const category = new Category();
    const newName = updateCategoryDto.name || oldCategory.name;
    category.name = newName;
    category.slug = slugify(newName, {
      replacement: '-',
      lower: true,
      trim: true,
    });
    category.logo = updateCategoryDto.logo || oldCategory.logo;
    category.updatedBy = user._id;
    return category;
  }
}
