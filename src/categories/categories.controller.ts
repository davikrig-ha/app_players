import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategorieDto } from "./dtos/create-categorie.dto";
import { Categorie } from "./interfaces/categorie.interface";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategorie(
    @Body() createCategorieDto: CreateCategorieDto
  ): Promise<Categorie> {
    return await this.categoriesService.createCategorie(createCategorieDto);
  }
}
