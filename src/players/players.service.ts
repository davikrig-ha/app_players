import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { Player } from "./interfaces/player.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  constructor(
    @InjectModel("Player") private readonly playerModel: Model<Player>
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createdPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const findPlayer = await this.playerModel.findOne({ email }).exec();

    if (findPlayer) {
      throw new BadRequestException(`Player of mail ${email} already exists`);
    }

    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async UpdatePlayer(
    id: string,
    createPlayerDto: CreatePlayerDto
  ): Promise<void> {
    const findPlayer = await this.playerModel.findOne({ id }).exec();

    if (!findPlayer) {
      throw new NotFoundException(`Player of id ${id} not found!`);
    }

    await this.playerModel
      .findOneAndUpdate({ id }, { $set: createPlayerDto })
      .exec();
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerId(id: string): Promise<Player> {
    const findPlayer = await this.playerModel.findOne({ id }).exec();
    if (!findPlayer) {
      throw new NotFoundException(`Player of this id ${id} not found!`);
    }
    return findPlayer;
  }

  async deletePlayer(id): Promise<any> {
    const findPlayer = await this.playerModel.findOne({ id }).exec();
    if (!findPlayer) {
      throw new NotFoundException(`Player of this id ${id} not found!`);
    }
    return await this.playerModel.deleteOne({ id }).exec();
  }
}
