import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PlayersService } from "src/players/players.service";
import { CreateCategorieDto } from "./dtos/create-categorie.dto";
import { UpdateCategorieDto } from "./dtos/update-categorie.dto";
import { Categorie } from "./interfaces/categorie.interface";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Categorie") private readonly categorieModel: Model<Categorie>,
    private readonly playersService: PlayersService
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

  async consultAllCategories(): Promise<Array<Categorie>> {
    return await this.categorieModel.find().populate("players").exec();
  }

  async consultOneCategorie(categorie: string): Promise<Categorie> {
    const findCategorie = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!findCategorie) {
      throw new NotFoundException(`Ctegorie ${categorie} not found!`);
    }
    return findCategorie;
  }

  async updateCategorie(
    categorie: string,
    updateCategorieDto: UpdateCategorieDto
  ): Promise<void> {
    const findCategorie = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!findCategorie) {
      throw new NotFoundException(`Categorie ${categorie} not found!`);
    }
    await this.categorieModel
      .findOneAndUpdate({ categorie }, { $set: updateCategorieDto })
      .exec();
  }

  async atributeCategoriePlayer(params: string[]): Promise<void> {
    const categorie = params["categorie"];
    const idPlayer = params["idPlayer"];

    const findCategorie = await this.categorieModel
      .findOne({ categorie })
      .exec();
    const registredCtegoriePlayer = await this.categorieModel
      .find({ categorie })
      .where("jogadores")
      .in(idPlayer)
      .exec();

    await this.playersService.consultPlayerId(idPlayer);

    if (!findCategorie) {
      throw new BadRequestException(`Categorie ${categorie} not found!`);
    }

    if (registredCtegoriePlayer.length > 0) {
      throw new BadRequestException(
        `player ${idPlayer} already exists in Categorie ${categorie}!`
      );
    }
    findCategorie.players.push(idPlayer);
    await this.categorieModel
      .findOneAndUpdate({ categorie }, { $set: findCategorie })
      .exec();
  }
}
