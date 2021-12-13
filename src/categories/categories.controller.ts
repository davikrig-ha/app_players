import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategorieDto } from "./dtos/create-categorie.dto";
import { UpdateCategorieDto } from "./dtos/update-categorie.dto";
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

  @Get()
  async consultAllCategories(): Promise<Array<Categorie>> {
    return await this.categoriesService.consultAllCategories();
  }

  @Get("/:categorie")
  async consultOneCategorie(
    @Param("categorie") categorie: string
  ): Promise<Categorie> {
    return await this.categoriesService.consultOneCategorie(categorie);
  }

  @Put("/:categorie")
  @UsePipes(ValidationPipe)
  async updateCategorie(
    @Body() updateCategorieDto: UpdateCategorieDto,
    @Param("categorie") categorie: string
  ): Promise<void> {
    await this.categoriesService.updateCategorie(categorie, updateCategorieDto);
  }

  @Post("/:categorie/players/:idPlayer")
  async atributeCategoriePlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.atributeCategoriePlayer(params);
  }
}
