import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategorieDto } from "./dtos/create-categorie.dto";
import { Categorie } from "./interfaces/categorie.interface";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Categorie") private readonly categorieModel: Model<Categorie>
  ) {}

  async createCategorie(
    createCategorieDto: CreateCategorieDto
  ): Promise<Categorie> {
    const { categorie } = createCategorieDto;
    const findCategorie = await this.categorieModel
      .findOne({ categorie })
      .exec();
    if (findCategorie) {
      throw new BadRequestException(`categorie ${categorie} already exists`);
    }
    const createCategorie = new this.categorieModel(createCategorieDto);
    return await createCategorie.save();
  }
}
